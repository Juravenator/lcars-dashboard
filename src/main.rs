use axum::{Router, http, routing::get};
use tower_http::cors;
use tower_http::cors::CorsLayer;
use tokio::signal;

use crate::static_files::static_handler;

mod endpoints;
mod static_files;

#[tokio::main]
async fn main() {
    rustls::crypto::aws_lc_rs::default_provider()
        .install_default()
        .expect("Failed to install rustls crypto provider");
    let app = Router::new()
        .route("/api/zpools", get(endpoints::zpools::get))
        .route("/api/deployments", get(endpoints::deployments::get))
        .route(
            "/api/deployments/{namespace}/{kind}/{name}/restart",
            get(endpoints::deployments::restart),
        )
        .route("/api/metrics", get(endpoints::metrics::get))
        .route("/api/vistars/{*path}", get(endpoints::vistars::get))
        .fallback(static_handler)
        .layer(
            CorsLayer::new()
                .allow_origin(cors::Any)
                .allow_methods([http::Method::GET]),
        );

    axum::serve(
        tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap(),
        app,
    )
    .with_graceful_shutdown(shutdown_signal())
    .await
    .unwrap();
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install sigterm handler");
    };

    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install sigterm handler")
            .recv()
            .await;
    };

    tokio::select! {
        _ = ctrl_c => println!("sigint"),
        _ = terminate => println!("sigterm"),
    }
}
