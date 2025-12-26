#!/usr/bin/env bash
set -e
# ----- Config environment default  -----
case "${APP_ENV:-dev}" in
  prod) : "${NODE_ENV:=production}"; : "${RUN_MIGRATIONS:=false}"; ;;
  uat)  : "${NODE_ENV:=staging}";    : "${RUN_MIGRATIONS:=false}"; ;;
  *)    : "${NODE_ENV:=development}";: "${RUN_MIGRATIONS:=true}";  ;;
esac
export NODE_ENV RUN_MIGRATIONS
echo "[entrypoint] Environment: APP_ENV=${APP_ENV}, NODE_ENV=${NODE_ENV}, RUN_MIGRATIONS=${RUN_MIGRATIONS}"

# ----- waiting database -----
echo "[entrypoint] waiting database"
ready=""
for i in {1..60}; do
  if [ -n "${DATABASE_URL:-}" ]; then
    if psql "${DATABASE_URL}" -c "select 1" >/dev/null 2>&1; then ready=1; break; fi
  else
    if [ -n "${DATABASE_HOST:-}" ] && [ -n "${DATABASE_USER:-}" ] && [ -n "${DATABASE_DB:-}" ]; then
      if PGPASSWORD="${DATABASE_PASSWORD:-}" psql -h "${DATABASE_HOST}" -U "${DATABASE_USER}" -p "${DATABASE_PORT:-5432}" -d "${DATABASE_DB}" -c "select 1" >/dev/null 2>&1; then ready=1; break; fi
    fi
  fi
  echo "[entrypoint] DB not ready yet .. try for 2 seconds ($i)"; sleep 2
done
[ -n "$ready" ] || { echo "[entrypoint] Error: Cannot connect Database for 60 times"; exit 1; }
echo "[entrypoint] Database ready!"

# -----  migrations  -----
if [ "${RUN_MIGRATIONS}" = "true" ]; then
  echo "[entrypoint] Running  migrations..."
  npx typeorm-ts-node-commonjs migration:run -d dist/src/core/database/data-source.js || { echo "[entrypoint] Error: Migration fail"; exit 1; }
else
  echo "[entrypoint] Skip migrations"
fi

# ----- Start APP -----
PORT_INTERNAL="${PORT:-3000}"
ENTRY="dist/main.js"; [ -f "$ENTRY" ] || ENTRY="dist/src/main.js"
[ -f "$ENTRY" ] || { echo "[entrypoint] Error: Not found  entry file (dist/main.js or dist/src/main.js)"; exit 1; }
echo "[entrypoint] Start app successfully :${PORT_INTERNAL} → $ENTRY"
exec node "$ENTRY"