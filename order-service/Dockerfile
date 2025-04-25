# Base image
FROM node:18

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy source code
COPY . .

# Expose service port
EXPOSE 3002

# Start with nodemon
CMD ["nodemon", "src/server.js"]
