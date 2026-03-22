FROM node:25.8-alpine AS web

RUN apk --no-cache add just rsync
WORKDIR /app

COPY web/package.json web/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY web/ .
RUN just build

FROM rust:1.94-alpine AS builder

RUN apk --no-cache add musl-dev
WORKDIR /app

COPY . .
COPY --from=web /app/dist web/dist
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/app/target \
    cargo build --release && \
    cp target/x86_64-unknown-linux-musl/release/dashboard-api .

FROM scratch

COPY --from=builder /app/dashboard-api /
CMD ["/dashboard-api"]
