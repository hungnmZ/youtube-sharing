#!/bin/sh
set -e

docker pull manhung99/youtube-sharing-frontend:latest
docker pull manhung99/youtube-sharing-backend:latest

docker compose up -d --no-build