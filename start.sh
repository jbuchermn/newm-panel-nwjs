#!/bin/sh
if [ $1 == "wrap" ]; then
    NW_PATH=/usr/lib/node_modules/nw/bin
    TMP_DIR=/tmp/.nw-$$

    mkdir -p $TMP_DIR
    $NW_PATH/nw $2/build --enable-features=UseOzonePlatform --ozone-platform=wayland --user-data-dir=$TMP_DIR
else
    nw $2/build --enable-features=UseOzonePlatform --ozone-platform=wayland
fi
