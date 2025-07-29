# Use Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy root-level package files
COPY package*.json ./

RUN npm install --legacy-peer-deps

# Install ts-node and typescript globally
RUN npm install -g ts-node typescript

# Copy backend code into the container
COPY backend/ ./backend

# Set working directory to backend
WORKDIR /app/backend

# Expose backend port
EXPOSE 4000

# Run the backend server
CMD ["npx", "ts-node", "server.ts"]