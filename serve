#!/bin/bash

if ! [ -x "$(command -v python3)" ]; then
  echo 'Error: Python3 is not installed.' >&2
  exit 1
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
  echo "Port 3000 is already in use"
  exit 1
fi

cd static/
python3 -m http.server 3000
