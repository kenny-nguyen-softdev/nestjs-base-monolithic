#!/bin/bash

# Exit immediately if any command fails
set -e

echo "🚀 Starting LIEM LAN API deployment..."

# Manually source NVM for non-interactive SSH sessions
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 22 > /dev/null

echo "🔎 Node: $(which node) - $(node -v)"
echo "🔎 NPM: $(which npm) - $(npm -v)"

# 1. Navigate to your project directory
cd /opt/main/api.liemlan.galloptech.net
echo "📁 Current directory: $(pwd)"

# 2. Check current branch and remote
echo "🔍 Git status before pull:"
git status
echo "🔁 Current branch: $(git rev-parse --abbrev-ref HEAD)"
echo "🔗 Remote URL: $(git remote get-url origin)"

# 3. Pull the latest code from the git repository
echo "🔄 Pulling latest code from Git..."
git reset --hard
git clean -fd -e deploy.sh
git fetch origin
git checkout develop
git pull origin develop

# 4. Confirm latest commit
echo "🧾 Latest commit pulled:"
git log -1 --oneline

# 5. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 6. Build the NestJS app
echo "🏗️ Building the application..."
npm run build

# 6.1 Run database migrations
echo "📂 Running migrations..."
npm run migration:migrate

# 6.2 Run database seeders
echo "🌱 Running seeders..."
npm run seed:migrate

# 7. Restart with PM2
APP_NAME="api.liemlan.galloptech.net"
APP_ENTRY="dist/src/main.js"

echo "♻️ Restarting app with PM2..."
if pm2 list | grep -q "$APP_NAME"; then
  echo "✅ App is running — restarting..."
  pm2 restart "$APP_NAME"
else
  echo "🔰 App not running — starting..."
  pm2 start "$APP_ENTRY" --name "$APP_NAME"
fi

# 8. Save the PM2 process list
pm2 save

echo "✅ Deployment completed successfully!"
