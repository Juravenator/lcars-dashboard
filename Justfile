release:
    #!/usr/bin/env bash
    set -o errexit -o nounset -o pipefail
    last_tag=$(git tag | tail -n1)
    read -p "Release version (last=$last_tag): v" tag
    sed -i "s|^version = .*|version = \"$tag\"|" Cargo.toml
    cargo update
    git commit -m "release v$tag"
    git tag "v$tag"
    git push
    git push --tags
