FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable pnpm && pnpm install --frozen-lockfile

COPY . .

RUN corepack enable pnpm && pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]