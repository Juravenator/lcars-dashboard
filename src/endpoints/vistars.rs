use axum::{extract::Path, response::{IntoResponse, Response}};
use reqwest::StatusCode;

pub async fn get(Path(location): Path<String>) -> Response {
    let client = reqwest::Client::new();

    let url = format!("https://vistar-capture.s3.cern.ch/{}", location);

    match client.get(url).send().await {
        Ok(resp) => {
            let status = resp.status();
            let body = resp.bytes().await.unwrap();
            (status, body).into_response()
        }
        Err(_) => (StatusCode::BAD_GATEWAY, "Upstream request failed").into_response(),
    }
}
