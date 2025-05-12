pipeline {
    agent any
    
    environment {
        // Replace this with your actual EC2 instance's public IP address
        AWS_INSTANCE_IP = "13.48.190.148"  
    }

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
                git branch: 'main', url: 'https://github.com/usman-qasimcs/bookdevops.git',  
                    changelog: false, poll: false, 
                    destination: '/var/lib/jenkins/DevOps/bookapp/'
            }
        }

        stage('Copy Docker Configuration') {
            steps {
                dir('/var/lib/jenkins/DevOps/bookapp/') {
                    // Ensure Docker configurations are in place
                    sh '''
                    if [ ! -f "Dockerfile.client" ]; then
                        echo "Creating Dockerfile.client..."
                        cat > Dockerfile.client << 'EOL'
# Client Dockerfile
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy client source files
COPY client/ ./

# Build the React application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from previous stage to nginx serve directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
EOL
                    fi

                    if [ ! -f "Dockerfile.server" ]; then
                        echo "Creating Dockerfile.server..."
                        cat > Dockerfile.server << 'EOL'
# Server Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY server/package*.json ./

# Install dependencies
RUN npm install --production

# Copy server source files
COPY server/ ./

# Expose the port your server is running on
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
EOL
                    fi

                    // Create or update docker-compose.yml with the correct EC2 IP
                    echo "Creating/updating docker-compose.yml with EC2 IP: \${AWS_INSTANCE_IP}"
                    cat > docker-compose.yml << EOL
version: "3.8"

services:
  client:
    build:
      context: .
      dockerfile: Dockerfile.client
    image: ru0300usman/myapp3-client:latest
    ports:
      - "80:80"  # Maps host port 80 to container port 80
    depends_on:
      - server
  server:
    build:
      context: .
      dockerfile: Dockerfile.server
    image: ru0300usman/myapp3-server:latest
    ports:
      - "5000:5000"  # Maps host port 5000 to container port 5000
    environment:
      - MONGO_URI=mongodb+srv://usmanqasimcsa:usmanawt@cluster0.jnelddy.mongodb.net/
      - NODE_ENV=production
      - CLIENT_URL=http://server
EOL
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
        
        stage('Verify Deployment') {
            steps {
                sh 'curl -s http://127.0.0.1:5000/health || echo "Server health check failed"'
                sh 'curl -s http://13.48.190.148:80 | grep -q "root" && echo "Client is running" || echo "Client check failed"'
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
            sh 'docker compose -p bookdevops down || echo "No containers to stop"'
        }
    }
}
