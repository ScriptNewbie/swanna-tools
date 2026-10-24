# syntax=docker.io/docker/dockerfile:1

# Pin the Oct 21, 2026 Node.js security release (CVE-2026-111497 Brotli
# RCE and the other runtime CVEs). A floating node:24-alpine tag can reuse
# a cached 24.22.0 layer. node:24.22.1-alpine (Alpine 3.24.3) already ships
# zlib 1.3.2-r1 and OpenSSL 3.5.9-r0; apk upgrade still picks up later
# Alpine patches. Bundled npm is still 11.19.1, so install npm 11.21.1
# (first 11.x whose tree updates brace-expansion, undici,
# postcss-selector-parser, and http-cache-semantics). npm 11.21.1 and
# npm 12.2.1 still ship ip-address 10.7.2 (GHSA-rxp7-6hxx-x8q5 /
# CVE-2026-111997, fixed in 10.7.4). socks and @npmcli/agent accept ^10.1.x.
# The same npm tree ships undici 6.29.0 for node-gyp (^6.25.0). That copy is
# affected by GHSA-xjj6-f33q-929c / CVE-2026-109869 and GHSA-4qv8-2p9j-2685 /
# CVE-2026-109924, both fixed in 6.29.1. Node's own undici is already 7.30.1
# (process.versions.undici); only the npm CLI copy needs this overlay.
FROM node:24.22.1-alpine AS base

RUN apk add --no-cache --upgrade zlib libcrypto3 libssl3 \
 && npm install -g npm@11.21.1 \
 && npm pack ip-address@10.7.4 undici@6.29.1 --pack-destination /tmp \
 && rm -rf /usr/local/lib/node_modules/npm/node_modules/ip-address \
 && mkdir -p /usr/local/lib/node_modules/npm/node_modules/ip-address \
 && tar -xzf /tmp/ip-address-10.7.4.tgz -C /usr/local/lib/node_modules/npm/node_modules/ip-address --strip-components=1 \
 && rm -rf /usr/local/lib/node_modules/npm/node_modules/undici \
 && mkdir -p /usr/local/lib/node_modules/npm/node_modules/undici \
 && tar -xzf /tmp/undici-6.29.1.tgz -C /usr/local/lib/node_modules/npm/node_modules/undici --strip-components=1 \
 && rm -f /tmp/ip-address-10.7.4.tgz /tmp/undici-6.29.1.tgz \
 && node -e "const ip=require('/usr/local/lib/node_modules/npm/node_modules/ip-address/package.json').version; const u=require('/usr/local/lib/node_modules/npm/node_modules/undici'); const uv=require('/usr/local/lib/node_modules/npm/node_modules/undici/package.json').version; if (ip!=='10.7.4' || uv!=='6.29.1' || !u.fetch) { console.error('unexpected', ip, uv); process.exit(1); }"

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]