# Prisma 7.3.0 — WSC2026 app + MySQL 8.4

```bash
docker compose up --build
```

Open **http://localhost:3000** — an Express + Prisma app. On start it waits for MySQL 8.4,
applies the schema (`prisma db push`), seeds rows, and serves them. JSON: `GET /api/tasks`.
Pinned: Node 24.1.0 / npm 11.5.0, Prisma 7.3.0, MySQL 8.4.
