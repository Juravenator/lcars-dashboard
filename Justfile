# print available commands
help:
    just --list

# create a demo zpool
testpool:
    #!/usr/bin/env bash
    sudo zpool destroy testpool ||:
    mkdir -p testpool
    cd testpool
    for i in {0..3} ; do test -f $i.raw || truncate -s 1G $i.raw ; done
    find $PWD/*.raw | xargs sudo zpool create -o ashift=12 testpool raidz2

# create and push a new tagged release
release:
    #!/usr/bin/env bash
    set -o errexit -o nounset -o pipefail
    last_tag=$(git tag | tail -n1)
    read -p "Release version (last=$last_tag): v" tag
    sed -i "s|^version = .*|version = \"$tag\"|" Cargo.toml
    cargo update
    git add Cargo.toml Cargo.lock
    git commit -m "release v$tag"
    git tag "v$tag"
    git push
    git push --tags
