FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS build
WORKDIR /app
COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts

RUN npx prisma generate

RUN pnpm build

RUN pnpm prune --prod

RUN apk update && apk add --no-cache \
  jq \
  && rm -rf /var/cache/apk/* \
  && jq .version ./package.json -r > version.txt

FROM base AS production
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/version.txt ./version.txt

CMD npm_package_version=$(cat ./version.txt) node dist/main


