# Stage 1: Build client assets and prepare server dependencies
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker layer caching
COPY package*.json ./

# Install all dependencies (including devDependencies for build and tsx)
RUN npm ci

# Copy all source files
COPY . .

# Build the client frontend
RUN npm run build

# Stage 2: Production runtime image
FROM node:20-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy compiled frontend build assets from the builder stage
COPY --from=builder /app/dist ./dist

# Copy backend server files
COPY --from=builder /app/server ./server

# Copy data and types files needed by the server
COPY --from=builder /app/src/data.ts ./src/data.ts
COPY --from=builder /app/src/types.ts ./src/types.ts

# Copy all node_modules (required since start command uses tsx to run TS server file)
COPY --from=builder /app/node_modules ./node_modules

# Expose port (application runs on port 5000 by default)
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start the Express server
CMD ["npm", "run", "start"]
