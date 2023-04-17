FROM node:16.16.0-alpine3.15 AS build

RUN apk update && apk add bash

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npx ts-node scripts/migrations-copy.ts && npm prune --production

RUN rm -rf /app/dist/src/orm/seeders/*.d.ts /app/dist/src/orm/seeders/*.map
RUN chmod +x ./scripts/wait-for-it.sh ./scripts/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["./scripts/docker-entrypoint.sh"]
CMD [ "node", "dist/src/main.js" ]