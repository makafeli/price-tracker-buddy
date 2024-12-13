# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Expose port 8080
EXPOSE 8080

# Start the application
CMD ["npm", "run", "preview"]