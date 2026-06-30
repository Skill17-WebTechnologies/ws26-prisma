import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // set at runtime via compose; optional at build time (generate doesn't connect)
    url: process.env.DATABASE_URL,
  },
})
