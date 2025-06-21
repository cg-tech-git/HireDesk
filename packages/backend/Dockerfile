# Use Node.js 18 LTS as base image
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Build stage
FROM base AS builder

# Copy all package files
COPY package*.json ./
COPY tsconfig.json ./
COPY packages/backend/package.json ./packages/backend/

# Install all dependencies
RUN npm ci --ignore-scripts

# Copy backend source
COPY packages/backend/ ./packages/backend/

# Fix imports before building
WORKDIR /app/packages/backend
RUN cp src/types/local-shared.ts src/controllers/
RUN cp src/types/local-shared.ts src/entities/
RUN cp src/types/local-shared.ts src/services/
RUN cp src/types/local-shared.ts src/routes/
RUN cp src/types/local-shared.ts src/middleware/

# Fix imports to use local files
RUN find src -name "*.ts" -exec sed -i 's/from ['\''"]..\/..\/types\/local-shared['\'']/from '\''\.\/local-shared'\''/g' {} \;

# Build backend
RUN npm run build

# After build, copy the compiled local-shared.js files to the correct dist locations
RUN cp dist/types/local-shared.js dist/controllers/
RUN cp dist/types/local-shared.js dist/entities/
RUN cp dist/types/local-shared.js dist/services/
RUN cp dist/types/local-shared.js dist/routes/
RUN cp dist/types/local-shared.js dist/middleware/

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hiredesk

# Copy built application and dependencies from builder
COPY --from=builder --chown=hiredesk:nodejs /app/packages/backend/dist ./dist
COPY --from=builder --chown=hiredesk:nodejs /app/packages/backend/package.json ./package.json
COPY --from=builder --chown=hiredesk:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=hiredesk:nodejs /app/packages/backend/node_modules ./backend_node_modules

# Merge backend node_modules into app node_modules
RUN cp -r ./backend_node_modules/* ./node_modules/ 2>/dev/null || true && rm -rf ./backend_node_modules

USER hiredesk

EXPOSE 3001

# Start the application
CMD ["node", "dist/index.js"] 