FROM node:24.1.0-bookworm

# npm pinned to 11.5.0; corepack activates the pnpm/yarn version each repo pins via "packageManager"
RUN corepack enable && npm install -g npm@11.5.0

WORKDIR /app
COPY . .

RUN pnpm install

CMD ["sh", "-lc", "echo \"Prisma source ready. Build: pnpm build  |  Exec in: docker compose exec app sh\"; tail -f /dev/null"]
