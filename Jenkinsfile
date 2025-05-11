pipeline {
    agent any

    stages {
        stage('Clean Previous Deployment') {
            steps {
               sh '''
                if [ -d "/var/lib/jenkins/DevOps/" ]; then
                    find "/var/lib/jenkins/DevOps/" -mindepth 1 -delete
                    echo "Contents of /var/lib/jenkins/DevOps/ have been removed."
                else
                    echo "Directory /var/lib/jenkins/DevOps/ does not exist."
                    mkdir -p /var/lib/jenkins/DevOps/
                fi
                '''
            }
        }
        
        stage('Fetch Code') {
            steps {
                sh 'git clone https://github.com/usman-qasimcs/bookdevops.git /var/lib/jenkins/DevOps/bookapp/'
            }
        }

        stage('Copy Docker Configuration') {
            steps {
                dir('/var/lib/jenkins/DevOps/bookapp/') {
                    // Ensure Docker configurations are in place
                    sh '''
                    if [ ! -f "Dockerfile" ]; then
                        echo "Creating Dockerfile..."
                        cat > Dockerfile << 'EOL'
# Multi-stage build for a React app with separate client and server folders

# Stage 1: Build the client application
FROM node:18-alpine AS client-builder
WORKDIR /app/client
# Copy client package files
COPY ./client/package*.json ./
# Install client dependencies
RUN npm install
# Copy client source files
COPY ./client/ ./
# Build the client application
RUN npm run build

# Stage 2: Set up the server
FROM node:18-alpine AS server-builder
WORKDIR /app/server
# Copy server package files
COPY ./server/package*.json ./
# Install server dependencies
RUN npm install --production
# Copy server source files
COPY ./server/ ./

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
EOL
                    fi

                    if [ ! -f "docker-compose.yml" ]; then
                        echo "Creating docker-compose.yml..."
                        cat > docker-compose.yml << 'EOL'
version: "3.8"

services:
  frontend:
    build: .
    image: ru0300usman/myapp3:latest
    ports:
      - "4000:5000"  # Maps port 4000 on host to port 5000 in container (server port)
    environment:
      - MONGO_URI=mongodb+srv://usmanqasimcsa:usmanawt@cluster0.jnelddy.mongodb.net/
      - NODE_ENV=production
EOL
                    fi
                    '''
                }
            }
        }

        stage('Build and Start Docker Compose') {
            steps {
                dir('/var/lib/jenkins/DevOps/bookapp/') {
                    sh 'docker compose -p bookdevops up -d --build'
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}