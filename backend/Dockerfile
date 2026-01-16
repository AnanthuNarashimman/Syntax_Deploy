# Use official Node.js LTS (Long Term Support) image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only (reduces image size)
RUN npm ci --only=production

# Copy application code
COPY . .

# Note: Firebase service account JSON is NOT copied here
# It will be injected as FIREBASE_SERVICE_ACCOUNT environment variable
# from GCP Secret Manager at runtime

# Expose port (Cloud Run will inject PORT env variable)
EXPOSE 8080

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]
