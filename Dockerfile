FROM node:18-alpine as base

# Create app directory
WORKDIR /usr/src/app

# Install dependencies for production
COPY package*.json ./
RUN npm ci --only=production

# Create uploads directory with proper permissions
RUN mkdir -p uploads && chmod 777 uploads

# Bundle app source (exclude node_modules and other unnecessary files)
COPY . .

# Build stage for frontend
FROM node:18-alpine as frontend-builder
WORKDIR /usr/src/app/frontend
COPY src/frontend/package*.json ./
RUN npm ci
COPY src/frontend ./
RUN npm run build

# Final stage
FROM base as final
WORKDIR /usr/src/app

# Copy built frontend from frontend-builder stage
COPY --from=frontend-builder /usr/src/app/frontend/build /usr/src/app/src/frontend/build

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Use non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:5000/api/health || exit 1

# Start the app
CMD ["node", "src/backend/server.js"]
