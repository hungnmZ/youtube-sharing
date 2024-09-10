# Build images
docker compose build

# Tag images
docker tag youtube-sharing-frontend:latest manhung99/youtube-sharing-frontend:latest
docker tag youtube-sharing-backend:latest manhung99/youtube-sharing-backend:latest
docker tag mongo:latest manhung99/mongo:latest

# Push images
docker push manhung99/youtube-sharing-frontend:latest
docker push manhung99/youtube-sharing-backend:latest
docker push manhung99/mongo:latest

# SERVER
  docker tag manhung99/youtube-sharing-frontend:latest youtube-sharing-frontend:latest
  docker tag manhung99/youtube-sharing-backend:latest youtube-sharing-backend:latest
  docker tag manhung99/mongo:latest mongo:latest

  docker pull manhung99/youtube-sharing-frontend:latest
  docker pull manhung99/youtube-sharing-backend:latest
  docker pull manhung99/mongo:latest
  docker compose up -d --no-build