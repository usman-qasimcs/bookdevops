# Multi-stage build for a React app with separate client and server folders

# Stage 1: Build the client application
FROM node:18-alpine AS client-builder
WORKDIR /app/client
# Copy client package files
COPY client/package*.json ./
# Install client dependencies
RUN npm install
# Copy client source files
COPY client/ ./
# Build the client application
RUN npm run build

# Stage 2: Set up the server
FROM node:18-alpine AS server-builder
WORKDIR /app/server
# Copy server package files
COPY server/package*.json ./
# Install server dependencies
RUN npm install --production
# Copy server source files
COPY server/ ./

# Stage 3: Final image
FROM node:18-alpine
WORKDIR /app

# Copy built client from client-builder stage
COPY --from=client-builder /app/client/build /app/client/build

# Copy server files and node_modules from server-builder stage
COPY --from=server-builder /app/server /app/server

# Set the working directory to the server folder
WORKDIR /app/server

# Expose the port your server is running on
EXPOSE 5000

# Start the server
CMD ["npm", "start"]