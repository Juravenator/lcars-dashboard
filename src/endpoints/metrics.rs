use std::collections::HashMap;

use axum::Json;
use serde::Serialize;
use tokio::process::Command;

#[derive(Serialize)]
pub struct ApiResponse {
    metrics: HashMap<String, Vec<String>>,
}

pub async fn get() -> Json<ApiResponse> {
    let metrics = get_metrics().await.unwrap_or_default();
    Json(ApiResponse { metrics })
}

async fn get_metrics() -> Result<HashMap<String, Vec<String>>, anyhow::Error> {
    let mut stuff = HashMap::new();

    let data = Command::new("cut")
        .args(["-d.", "-f1", "/proc/uptime"])
        .output()
        .await?;
    let data = String::from_utf8(data.stdout)?.trim().to_owned();
    stuff.insert("up".into(), vec![data]);

    let data = Command::new("cat").args(["/proc/loadavg"]).output().await?;
    let data = data
        .stdout
        .split(|c| *c == b' ')
        .map(|v| String::from_utf8_lossy(v).to_string().trim().to_owned())
        .collect();
    stuff.insert("load".into(), data);

    let data = Command::new("grep")
        .args(["cpu ", "/proc/stat"])
        .output()
        .await?;
    let data = data
        .stdout
        .split(|c| *c == b' ')
        .map(|v| String::from_utf8_lossy(v).to_string().trim().to_owned())
        .skip(2)
        .collect();
    stuff.insert("cpu".into(), data);

    let data = Command::new("grep")
        .args(["-om5", "[0-9]*", "/proc/meminfo"])
        .output()
        .await?;
    let data = data
        .stdout
        .split(|c| *c == b'\n')
        .map(|v| String::from_utf8_lossy(v).to_string())
        .take(5)
        .collect();
    stuff.insert("mem".into(), data);

    let data = Command::new("cat")
        .args(["/proc/diskstats"])
        .output()
        .await?;
    let data = data
        .stdout
        .split(|c| *c == b'\n')
        .map(|line| {
            let mut pieces = line
                .split(|c| *c == b' ')
                .filter(|v| !v.is_empty())
                .map(|v| String::from_utf8_lossy(v))
                .map(|s| s.parse::<u64>().unwrap_or_default());
            let r = pieces.next().unwrap_or_default();
            pieces.next();
            pieces.next();
            let r_ms = pieces.next().unwrap_or_default();
            let w = pieces.next().unwrap_or_default();
            pieces.next();
            pieces.next();
            let w_ms = pieces.next().unwrap_or_default();
            [r, r_ms, w, w_ms]
        })
        .reduce(|a, b| [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]])
        .unwrap_or_default()
        .into_iter()
        .map(|i| i.to_string())
        .collect();
    stuff.insert("disk".into(), data);

    let data = Command::new("who").output().await?;
    let data = data.stdout.split(|c| *c == b'\n').count().to_string();
    stuff.insert("usr".into(), vec![data]);

    Ok(stuff)
}
