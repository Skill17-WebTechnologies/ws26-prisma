const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { PrismaMariaDb } = require('@prisma/adapter-mariadb')

// Fall back to a placeholder so the adapter constructs even when DATABASE_URL is unset
// (e.g. deployed without an in-cluster DB); queries then fail gracefully at request time.
const adapter = new PrismaMariaDb(process.env.DATABASE_URL || 'mysql://root@localhost:3306/prisma')
const prisma = new PrismaClient({ adapter })
const app = express()
const PORT = process.env.PORT || 80

async function getTasks() {
  try {
    return await prisma.task.findMany({ orderBy: { id: 'asc' } })
  } catch (e) {
    return null // database unavailable
  }
}

async function seed() {
  try {
    if ((await prisma.task.count()) === 0) {
      await prisma.task.createMany({
        data: [
          { title: 'Define the schema', done: true },
          { title: 'Run prisma db push', done: true },
          { title: 'Query from Express', done: false },
        ],
      })
    }
  } catch (e) {
    console.error('seed skipped (database not ready):', e.message)
  }
}

app.get('/api/tasks', async (req, res) => {
  const tasks = await getTasks()
  if (!tasks) return res.status(503).json({ orm: 'Prisma', version: '7.3.0', error: 'database unavailable' })
  res.json({ orm: 'Prisma', version: '7.3.0', tasks })
})

app.get('/', async (req, res) => {
  const tasks = await getTasks()
  const body = tasks
    ? `<ul>${tasks.map(t => `<li>${t.done ? '✅' : '⬜️'} ${t.title}</li>`).join('')}</ul>`
    : `<p>⚠️ Database not connected. Start with <code>docker compose up</code> for the bundled MySQL.</p>`
  res.type('html').send(`<!doctype html><html><head><meta charset="utf-8"><title>WSC2026 · Prisma 7.3.0</title>
  <style>body{font-family:system-ui,sans-serif;margin:0;min-height:100vh;display:grid;place-items:center;background:#0b1020;color:#e7ecff}.card{background:#151c33;padding:2.5rem 3rem;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.4)}.v{color:#5a67d8}ul{line-height:1.9}code{background:#0b1020;padding:.15rem .4rem;border-radius:6px}</style></head>
  <body><main class="card"><h1>Prisma <span class="v">7.3.0</span></h1>
  <p>WSC2026 Web Technologies — Express + Prisma (mariadb adapter), data from MySQL 8.4.</p>
  ${body}<p>JSON: <code>GET /api/tasks</code></p></main></body></html>`)
})

// Bind the port immediately so the container stays up even if the DB is unreachable.
app.listen(PORT, '0.0.0.0', () => console.log(`Prisma app on http://0.0.0.0:${PORT}`))
seed()
