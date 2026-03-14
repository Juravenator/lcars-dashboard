# https://github.com/devcontainers/images/tree/main/src
FROM mcr.microsoft.com/devcontainers/rust:2-1

RUN apt update && apt install -y musl-tools
RUN rustup target add x86_64-unknown-linux-musl