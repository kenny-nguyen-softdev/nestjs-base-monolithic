#!/bin/bash
set -Eeuo pipefail
echo "🔄 Step 1: Syncing deployment scripts from Git..."
git fetch origin develop
git reset --hard origin/develop
ENV_NAME="${1:-}"
BUILD_TAG_FROM_PIPELINE="${2:-}"

if [ -z "$ENV_NAME" ] || [ -z "$BUILD_TAG_FROM_PIPELINE" ]; then
  echo " Error: Supply environment  -> bash $0 dev abcdef12"
  exit 1
fi
# LOAD config from .env.deploy
CONFIG_FILE=".env.deploy"
if [ ! -f "$CONFIG_FILE" ]; then
  echo " Error: Not found  file config: $CONFIG_FILE"
  exit 1
fi
set -a 
source "$CONFIG_FILE"
set +a
echo " Loaded: $CONFIG_FILE"
# Config
COMPOSE_FILE="docker-compose.${ENV_NAME}.yml"
export BUILD_TAG="$BUILD_TAG_FROM_PIPELINE"
echo " used image tag pipeline: ${DOCKER_IMAGE_NAME}:${BUILD_TAG}"
# Login Docker hub
echo " Login into Docker Hub..."
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USER" --password-stdin || { echo " Error: Login into Docker hub "; exit 1; }
#  Pull newest image from Docker Hub
echo " Pulling image mới nhất từ Docker Hub..."
docker compose -f "$COMPOSE_FILE" pull api || { echo " Error: Pull Docker image fail."; exit 1; }
# Restart container Docker Compose
echo " Deploy container với Docker Compose..."
docker compose -f "$COMPOSE_FILE" up -d --force-recreate

echo " Clean up unused Docker images..."
docker image prune -a -f

echo "Successfully deploy for image '${DOCKER_IMAGE_NAME}:${BUILD_TAG}'!"