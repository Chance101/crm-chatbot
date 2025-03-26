FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Create uploads directory
RUN mkdir -p uploads

# Bundle app source
COPY . .

# Build frontend
RUN cd src/frontend && npm install && npm run build

# Expose port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

CMD ["node", "src/backend/server.js"]
