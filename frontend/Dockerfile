# Stage 1: Build the Vite frontend
FROM node:20-alpine AS builder
WORKDIR /app/frontend

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Install TypeScript if needed
RUN npm install --save-dev typescript

RUN npm run build

# Optionally remove dev dependencies afterwards
RUN npm prune --production


# Stage 2: Serve the static files with Nginx
FROM nginx:alpine
WORKDIR /app/frontend

# Copy built site into nginx html folder
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Copy site nginx config (make sure this file exists in build context)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Optional: a basic healthcheck (docker will use HTTP GET to /)
# HEALTHCHECK --interval=30s --timeout=5s --start-period=5s CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
