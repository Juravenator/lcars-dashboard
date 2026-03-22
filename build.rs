fn main() {
    println!("cargo:rerun-if-changed=web/");

    let status = std::process::Command::new("bash")
        .arg("-c")
        .arg("cd web && npm ci && just build")
        .status()
        .expect("failed to build web UI");

    if !status.success() {
        panic!("web build failed");
    }
}