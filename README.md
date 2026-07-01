# Prisma 7.3.0 — WSC2026

A small **Express + Prisma 7.3.0** application (WorldSkills 2026 Web Technologies, TP17) backed by
a bundled **MySQL 8.4** database. On start it waits for the database, applies the schema
(`prisma db push`), seeds a few rows, and serves them.

## Run it

```bash
docker compose up --build
```

Then open **http://localhost:3000** (JSON at `GET /api/tasks`). Data persists in a Docker volume.
Stop with `docker compose down` (add `-v` to also drop the DB).

## Develop

Edit the schema in **`prisma/schema.prisma`** and the server in **`server.js`**, then rebuild:

```bash
docker compose up --build
```

To re-apply a schema change against the running database without a full rebuild:

```bash
docker compose exec app npx prisma db push
```

Prisma 7 uses a driver adapter (`@prisma/adapter-mariadb`) and reads the connection string from
`DATABASE_URL` (set in `docker-compose.yml`); migrate settings live in `prisma.config.ts`.

## Stack

- Node 24.1.0 / npm 11.5.0
- Prisma 7.3.0 (`@prisma/client` + `@prisma/adapter-mariadb`), Express 5.2.1
- MySQL 8.4
