# Build stage for Node.js
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS base

RUN corepack enable

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn --immutable

# Build the Node.js app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarnrc.yml ./.yarnrc.yml
COPY . .
RUN yarn build

# Production image for Node.js
FROM base AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json ./
COPY --from=deps /app/node_modules ./node_modules

# Copy Atlas binary from arigaio/atlas image
FROM arigaio/atlas:latest-alpine as atlas
FROM alpine
COPY --from=atlas /atlas /atlas

# Final production image combining Node.js, migrations, and Atlas binary
FROM base as final
WORKDIR /app

COPY --from=runner /app /app
COPY --from=atlas /atlas /atlas
COPY --from=builder /app/migrations /migrations
COPY --from=builder /app/start.sh ./

# Optional: Define entrypoint for running the application (adjust as per your app requirements)
ENTRYPOINT [ "./start.sh" ]