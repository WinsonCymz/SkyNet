# ------------ Build stage ------------
FROM node:20-alpine AS build
WORKDIR /app

# Install deps (cache layer)
COPY package*.json ./
RUN npm ci

# Copy source
COPY public ./public
COPY src ./src

# Build static files to /app/build
RUN npm run build

# ------------ Runtime stage ------------
FROM nginx:1.27-alpine

# Remove default content (optional)
RUN rm -rf /usr/share/nginx/html/*

# Copy build output
COPY --from=build /app/build /usr/share/nginx/html

# (Optional) SPA routing (uncomment if you add a custom config):
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
# Default CMD from nginx image runs the server