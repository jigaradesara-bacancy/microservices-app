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
EXPOSE 3003

# Start with nodemon (worker)
CMD ["nodemon", "src/worker.js"]
