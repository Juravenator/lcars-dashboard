use axum::Json;
use serde::Serialize;
use std::process::Stdio;
use tokio::process::Command;

#[derive(Serialize)]
struct Disk {
    device: String,
    spinning: DiskStatus,
    kb_read: usize,
    kb_write: usize,
}

#[derive(Serialize)]
enum DiskStatus {
    STANDBY,
    ONLINE,
    UNKNOWN,
}

#[derive(Serialize)]
struct Pool {
    name: String,
    health: String,
    size: u64,
    alloc: u64,
    free: u64,
    disks: Vec<Disk>,
    status: String,
}

#[derive(Serialize)]
pub struct ApiResponse {
    pools: Vec<Pool>,
}

pub async fn get() -> Json<ApiResponse> {
    let pools = zpools().await.unwrap_or_default();
    Json(ApiResponse { pools })
}

async fn zpools() -> Result<Vec<Pool>, anyhow::Error> {
    let iostat = Command::new("iostat")
        .args(["-dy", "1", "1"])
        .output()
        .await?;
    let iostat = String::from_utf8(iostat.stdout)?;
    let iostat = iostat
        .lines()
        .filter_map(|l| {
            let mut p = l.split_whitespace();
            let device = p.next();
            let mut p = p.skip(4);
            let kb_read = p.next().and_then(|s| s.parse::<usize>().ok());
            let kb_write = p.next().and_then(|s| s.parse::<usize>().ok());
            match (device, kb_read, kb_write) {
                (Some(device), Some(kb_read), Some(kb_write)) => Some((device, kb_read, kb_write)),
                _ => None,
            }
        })
        .collect::<Vec<_>>();
    let zpool_list = Command::new("zpool")
        .args(["list", "-Hpo", "name,health,size,alloc,free"])
        .output()
        .await?;
    let zpool_list = String::from_utf8(zpool_list.stdout)?;
    let mut pools = Vec::new();

    for line in zpool_list.lines() {
        let parts = line.split_whitespace().collect::<Vec<_>>();
        if parts.len() < 5 {
            continue;
        }

        let name = parts[0].to_owned();
        let health = parts[1].to_owned();
        let size = parts[2].parse().unwrap();
        let alloc = parts[3].parse().unwrap();
        let free = parts[4].parse().unwrap();

        let zpool_status = Command::new("zpool")
            .args(["status", "-PL", &name])
            .output()
            .await?;
        let zpool_status = String::from_utf8(zpool_status.stdout)?;

        let disks = zpool_disks(&zpool_status, &iostat)
            .await
            .unwrap_or_default();

        let p = Pool {
            name,
            health,
            size,
            alloc,
            free,
            disks,
            status: zpool_status,
        };
        pools.push(p);
    }

    Ok(pools)
}

async fn zpool_disks(
    zpool_status: &str,
    iostat: &Vec<(&str, usize, usize)>,
) -> Result<Vec<Disk>, anyhow::Error> {
    let mut disks = Vec::new();

    for line in zpool_status.lines() {
        let line = line.trim();
        if line.starts_with("/") {
            let device = line.split_whitespace().next().unwrap().to_owned();
            let spinning = disk_status(&device).await;

            let (kb_read, kb_write) = match iostat.iter().find(|s| device.contains(s.0)) {
                Some((_, kb_read, kb_write)) => (*kb_read, *kb_write),
                _ => {
                    println!("WARN: cannot find io stats for device {device}");
                    println!(
                        "available devices: {}",
                        iostat
                            .iter()
                            .map(|(s, _, _)| *s)
                            .collect::<Vec<_>>()
                            .join(",")
                    );
                    (0, 0)
                }
            };

            disks.push(Disk {
                device,
                spinning,
                kb_read,
                kb_write,
            });
        }
    }

    Ok(disks)
}

async fn disk_status(device: &str) -> DiskStatus {
    let result = Command::new("smartctl")
        .args(["-n", "standby", "-i", device])
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .status()
        .await;

    match result.map(|s| s.code()) {
        Ok(Some(0)) => DiskStatus::ONLINE,
        Ok(Some(2)) => DiskStatus::STANDBY,
        _ => DiskStatus::UNKNOWN,
    }
}
