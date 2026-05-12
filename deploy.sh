#!/bin/sh
set -e

PLATFORM="${PLATFORM:-linux/amd64}"
CLERK_SECRET_KEY="${CLERK_SECRET_KEY:-sk_test_8LYLbrOonMrPHWF35ntrajqIvoVUrClmIy7CUs2Sii}"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:-pk_test_ZW1pbmVudC13ZWV2aWwtOTguY2xlcmsuYWNjb3VudHMuZGV2JA}"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="${NEXT_PUBLIC_CLERK_SIGN_IN_URL:-/sign-in}"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="${NEXT_PUBLIC_CLERK_SIGN_UP_URL:-/sign-up}"
NEXT_PUBLIC_BE_URL="${NEXT_PUBLIC_BE_URL:-http://backend:3000}"
NEXT_PUBLIC_BE_URL_PUBLIC="${NEXT_PUBLIC_BE_URL_PUBLIC:-http://109.237.70.69:3000}"

docker buildx create --name youtube-sharing-builder --use 2>/dev/null || docker buildx use youtube-sharing-builder
docker buildx inspect --bootstrap

docker buildx build \
  --platform "$PLATFORM" \
  -t manhung99/youtube-sharing-backend:latest \
  ./backend \
  --push

docker buildx build \
  --platform "$PLATFORM" \
  --build-arg CLERK_SECRET_KEY="$CLERK_SECRET_KEY" \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" \
  --build-arg NEXT_PUBLIC_CLERK_SIGN_IN_URL="$NEXT_PUBLIC_CLERK_SIGN_IN_URL" \
  --build-arg NEXT_PUBLIC_CLERK_SIGN_UP_URL="$NEXT_PUBLIC_CLERK_SIGN_UP_URL" \
  --build-arg NEXT_PUBLIC_BE_URL="$NEXT_PUBLIC_BE_URL" \
  --build-arg NEXT_PUBLIC_BE_URL_PUBLIC="$NEXT_PUBLIC_BE_URL_PUBLIC" \
  -t manhung99/youtube-sharing-frontend:latest \
  ./frontend \
  --push
