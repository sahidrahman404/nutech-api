#!/bin/sh
set -e

/atlas migrate apply --dir "file:///migrations" --url "sqlite:///data/nutech.db"
node dist/index.js
