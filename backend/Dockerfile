# Stage 1: Build the Node.js API (install dev deps so tsc is available)
FROM node:20-alpine AS builder
WORKDIR /app/api

# Copy lockfile + package.json first for caching
COPY package.json package-lock.json ./

# Install all deps (dev + prod) so tsc is present
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Remove dev dependencies to keep only production deps in node_modules
RUN npm prune --production

# Stage 2: Runtime image (only production files)
FROM node:20-alpine
WORKDIR /app/api

# Copy production node_modules and built output
COPY --from=builder /app/api/node_modules ./node_modules
# Adjust this to your build output folder (e.g. dist, build). 
COPY --from=builder /app/api/dist ./dist
COPY --from=builder /app/api/package.json ./package.json

EXPOSE 3000

# Start the compiled JS. Update path if your compiled entry is different.
CMD ["node", "dist/index.js"]
