use axum::http::Uri;
use axum::{
    http::{StatusCode, header},
    response::{IntoResponse, Response},
};
use mime_guess::{Mime, mime};
use rust_embed::{Embed, EmbeddedFile};

#[derive(Embed)]
#[folder = "../dashboard-canvas/dist"]
struct StaticFiles;

pub struct StaticFile<T>(pub T);

fn file(path: &str) -> Option<(EmbeddedFile, Mime)> {
    let mime = mime_guess::from_path(&path).first_or_octet_stream();
    file_with_mime(path, mime)
}
fn file_with_mime(path: &str, mime: Mime) -> Option<(EmbeddedFile, Mime)> {
    StaticFiles::get(&path).map(|f| (f, mime))
}

impl<T: Into<String>> IntoResponse for StaticFile<T> {
    fn into_response(self) -> Response {
        let path = self.0.into();

        let static_file =
            file(&path).or_else(|| file_with_mime(&format!("{path}.html"), mime::TEXT_HTML));

        match static_file {
            Some((file, mime)) => {
                ([(header::CONTENT_TYPE, mime.as_ref())], file.data).into_response()
            }
            None => match (
                file("index.html"),
                path.split(&['/', '|', ':'])
                    .last()
                    .unwrap_or_default()
                    .contains('.'),
            ) {
                (Some((file, mime)), false) => {
                    ([(header::CONTENT_TYPE, mime.as_ref())], file.data).into_response()
                }
                _ => (StatusCode::NOT_FOUND, "404 Not Found").into_response(),
            },
        }
    }
}

pub async fn static_handler(path: Uri) -> impl IntoResponse {
    let mut path = path.path().trim_start_matches('/');
    if path.is_empty() {
        path = "index.html";
    }
    StaticFile(path.to_owned())
}
