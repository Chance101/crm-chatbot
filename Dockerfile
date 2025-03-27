FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json
COPY package.json ./

# Install dependencies
RUN npm install

# Create necessary directories
RUN mkdir -p src/backend src/frontend src/uploads

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
