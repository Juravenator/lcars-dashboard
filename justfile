# print available commands
help:
    just --list

# build, run, and watch for changes
[parallel]
dev: tsc-watch run-server html-watch

# build everything
build: tsc html

# build, and watch for changes
[parallel]
build-watch: tsc-watch html-watch

# build and watch typescript
[group("internals")]
tsc-watch:
    watchexec -w src -- just tsc

# build typescript
[group("internals")]
tsc:
    mkdir -p dist tsc
    npx tsc
    npx rollup --config=rollup.mjs tsc/index.js --file dist/index.js

# build and watch html
[group("internals")]
html-watch:
    watchexec -w src -- just html

# build html
[group("internals")]
html:
    mkdir -p dist
    rsync -a src/*.html dist
    rsync -a src/assets dist

# run build
[group("internals")]
run-server:
    mkdir -p dist
    python3 -m http.server --bind 0.0.0.0 --directory dist

clean:
    rm -rf dist tsc