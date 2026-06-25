#!/usr/bin/env bash
# SapphireVibes — VPS deploy script
# Place on server: /var/www/sapphirevibes/deploy.sh
# Run: bash /var/www/sapphirevibes/deploy.sh

set -e

FRONTEND=/var/www/sapphirevibes/frontend
BACKEND=/var/www/sapphirevibes/backend
PM2_WEB=sapphirevibes-web
PM2_API=sapphirevibes-api

echo "── Pulling latest code ──────────────────────"
cd /var/www/sapphirevibes
git pull origin main

echo "── Frontend: install + build ─────────────────"
cd "$FRONTEND"
npm install --legacy-peer-deps
npm run build

echo "── Restarting web process ───────────────────"
pm2 restart "$PM2_WEB" || pm2 start npm --name "$PM2_WEB" -- start

# Uncomment if you also deploy the NestJS backend:
# echo "── Backend: install + restart ──────────────"
# cd "$BACKEND"
# npm install --legacy-peer-deps
# pm2 restart "$PM2_API" || pm2 start dist/main.js --name "$PM2_API"

pm2 save

echo ""
echo "✓ Deploy complete"
pm2 status
