FROM node:24.1.0-bookworm
RUN npm install -g npm@11.5.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
COPY docker-entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint
EXPOSE 3000
ENTRYPOINT ["entrypoint"]
