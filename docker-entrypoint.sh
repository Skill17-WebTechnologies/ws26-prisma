#!/usr/bin/env bash
set -e
cd /app
echo "Waiting for database + applying schema (prisma db push)..."
for i in $(seq 1 40); do
  if npx prisma db push >/tmp/push.log 2>&1; then echo "schema applied"; break; fi
  echo "  db not ready yet ($i)"; sleep 3
done
exec node server.js
