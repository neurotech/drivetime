FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

# Build stage - includes native compilation tools for better-sqlite3
FROM base AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Production stage - minimal runtime
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy database migrations for runtime migration support
COPY --from=builder /app/src/db/migrations ./src/db/migrations

# Copy better-sqlite3 native module
COPY --from=builder /app/node_modules/.pnpm/**/better-sqlite3 ./node_modules/better-sqlite3

# Copy migration script and entrypoint
COPY --from=builder /app/scripts/migrate.mjs ./scripts/migrate.mjs
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
