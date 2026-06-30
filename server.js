const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { PrismaMariaDb } = require('@prisma/adapter-mariadb')

const adapter = new PrismaMariaDb(process.env.DATABASE_URL)
const prisma = new PrismaClient({ adapter })
const app = express()
const PORT = process.env.PORT || 3000

async function seed() {
  const count = await prisma.task.count()
  if (count === 0) {
    await prisma.task.createMany({
      data: [
        { title: 'Define the schema', done: true },
        { title: 'Run prisma db push', done: true },
        { title: 'Query from Express', done: false },
      ],
    })
  }
}

app.get('/api/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany({ orderBy: { id: 'asc' } })
  res.json({ orm: 'Prisma', version: '7.3.0', tasks })
})

app.get('/', async (req, res) => {
  const tasks = await prisma.task.findMany({ orderBy: { id: 'asc' } })
  const rows = tasks.map(t => `<li>${t.done ? '✅' : '⬜️'} ${t.title}</li>`).join('')
  res.type('html').send(`<!doctype html><html><head><meta charset="utf-8"><title>WSC2026 · Prisma 7.3.0</title>
  <style>body{font-family:system-ui,sans-serif;margin:0;min-height:100vh;display:grid;place-items:center;background:#0b1020;color:#e7ecff}.card{background:#151c33;padding:2.5rem 3rem;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.4)}.v{color:#5a67d8}ul{line-height:1.9}code{background:#0b1020;padding:.15rem .4rem;border-radius:6px}</style></head>
  <body><main class="card"><h1>Prisma <span class="v">7.3.0</span></h1>
  <p>WSC2026 Web Technologies — Express + Prisma (mariadb adapter), data from MySQL 8.4.</p>
  <ul>${rows}</ul><p>JSON: <code>GET /api/tasks</code></p></main></body></html>`)
})

seed()
  .then(() => app.listen(PORT, '0.0.0.0', () => console.log(`Prisma app on http://0.0.0.0:${PORT}`)))
  .catch(err => { console.error(err); process.exit(1) })
