# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only package.json first (better caching)
COPY backend/package.json backend/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire backend code
COPY backend/ ./

# Expose port (if your app runs on 5000)
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
