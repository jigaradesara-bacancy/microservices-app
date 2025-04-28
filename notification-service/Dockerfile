# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose service port
EXPOSE 3003

# Start with node
CMD ["node", "src/index.js"]
