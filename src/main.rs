use axum::{Router, http, routing::get};
use tower_http::cors;
use tower_http::cors::CorsLayer;

use crate::static_files::static_handler;

mod endpoints;
mod static_files;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/api/zpools", get(endpoints::zpools::get))
        .route("/api/deployments", get(endpoints::deployments::get))
        .route(
            "/api/deployments/{namespace}/{name}/restart",
            get(endpoints::deployments::restart),
        )
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
    .await
    .unwrap();
}
