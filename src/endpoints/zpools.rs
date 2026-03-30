use axum::Json;
use serde::Serialize;
use std::process::Stdio;
use tokio::process::Command;

#[derive(Serialize)]
struct Disk {
    device: String,
    spinning: DiskStatus,
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
    let output = Command::new("zpool")
        .args(["list", "-Hpo", "name,health,size,alloc,free"])
        .output()
        .await?;

    let stdout = String::from_utf8(output.stdout)?;
    let mut pools = Vec::new();

    for line in stdout.lines() {
        let parts = line.split_whitespace().collect::<Vec<_>>();
        if parts.len() < 5 {
            continue;
        }

        let name = parts[0].to_owned();
        let health = parts[1].to_owned();
        let size = parts[2].parse().unwrap();
        let alloc = parts[3].parse().unwrap();
        let free = parts[4].parse().unwrap();
        
        let status = Command::new("zpool")
            .args(["status", "-PL", &name])
            .output()
            .await?;
        let status = String::from_utf8(status.stdout)?;

        let disks = zpool_disks(&status).await.unwrap_or_default();

        let p = Pool {
            name,
            health,
            size,
            alloc,
            free,
            disks,
            status,
        };
        pools.push(p);
    }

    Ok(pools)
}

async fn zpool_disks(status: &str) -> Result<Vec<Disk>, anyhow::Error> {
    let mut disks = Vec::new();

    for line in status.lines() {
        let line = line.trim();
        if line.starts_with("/") {
            let device = line.split_whitespace().next().unwrap().to_owned();
            let spinning = disk_status(&device).await;
            disks.push(Disk { device, spinning });
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
