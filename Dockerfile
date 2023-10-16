# Install dependencies only when needed
FROM node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci --force; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 userapp

COPY --from=builder --chown=userapp:nodejs /app/dist ./
COPY --from=builder --chown=userapp:nodejs /app/package.json ./package.json
COPY --from=builder --chown=userapp:nodejs /app/.env.prod ./.env
COPY --from=builder --chown=userapp:nodejs /app/ecosystem.config.js ./ecosystem.config.js

RUN npm install --only=prod --force

RUN npm install -g pm2

USER userapp

EXPOSE 3000

ENV PORT 3000

# CMD [ "node", "index" ]

CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]