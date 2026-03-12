use axum::{
    Json,
    extract::Path,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use k8s_openapi::{
    api::{apps::v1::Deployment, core::v1::Event},
    jiff::{SignedDuration, Timestamp},
};
use kube::api::{Patch, PatchParams};
use kube::{Api, Client, ResourceExt, api::ListParams};
use serde::Serialize;
use serde_json::json;

#[derive(Serialize)]
struct DeployData {
    namespace: String,
    name: String,
    num_desired: i32,
    num_ready: i32,
}

#[derive(Serialize)]
pub struct ApiResponse {
    deployments: Vec<DeployData>,
}

pub async fn get() -> Json<ApiResponse> {
    let deployments = list_deployments().await.unwrap_or_default();
    Json(ApiResponse { deployments })
}

pub async fn restart(Path((namespace, name)): Path<(String, String)>) -> Response {
    match restart_deployment(&namespace, &name).await {
        Ok(()) => StatusCode::OK.into_response(),
        Err(err) => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()).into_response(),
    }
}

async fn list_deployments() -> Result<Vec<DeployData>, anyhow::Error> {
    let client = Client::try_default().await?;
    let api: Api<Deployment> = Api::all(client);

    let deploys = api.list(&Default::default()).await?;

    let deploys = deploys
        .into_iter()
        .map(|d| DeployData {
            namespace: d.metadata.namespace.clone().unwrap_or("default".to_owned()),
            name: d.name_any(),
            num_desired: d
                .status
                .as_ref()
                .and_then(|s| s.replicas)
                .unwrap_or_default(),
            num_ready: d
                .status
                .as_ref()
                .and_then(|s| s.ready_replicas)
                .unwrap_or_default(),
        })
        .collect::<Vec<_>>();

    Ok(deploys)
}

async fn restart_deployment(namespace: &str, name: &str) -> Result<(), anyhow::Error> {
    let client = Client::try_default().await?;
    let api: Api<Event> = Api::namespaced(client, namespace);

    let lp = ListParams::default().fields(&format!("involvedObject.name={}", name));

    let mut events = api.list(&lp).await?.items;

    events.retain(|e| {
        e.reason.as_deref() == Some("ScalingReplicaSet")
            || e.reason.as_deref() == Some("SuccessfulRescale")
    });

    events.sort_by_key(|e| e.last_timestamp.clone());
    if let Some(time) = events.last().and_then(|e| e.last_timestamp.as_ref()) {
        let s = Timestamp::now().duration_since(time.0);
        if s < SignedDuration::from_mins(1) {
            return Err(anyhow::format_err!(
                "deployment has already been scaled less than 1min ago"
            ));
        }
    }

    let client = Client::try_default().await?;
    let api: Api<Deployment> = Api::namespaced(client, namespace);

    let patch = json!({
        "spec": {
            "template": {
                "metadata": {
                    "annotations": {
                        "kubectl.kubernetes.io/restartedAt": Timestamp::now(),
                    }
                }
            }
        }
    });

    api.patch(name, &PatchParams::default(), &Patch::Merge(&patch))
        .await?;

    Ok(())
}
