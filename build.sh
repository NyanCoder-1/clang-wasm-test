#!/bin/sh

mkdir -p ./wasm/

clang --target=wasm32 --no-standard-libraries -Wl,--export-table -Wl,--no-entry -Wl,--allow-undefined -Wl,--export=main -o ./wasm/app.wasm ./main.cpp -DPLATFORM_WEB