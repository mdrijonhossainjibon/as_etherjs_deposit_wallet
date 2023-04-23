# Use the official Node.js base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code to the container
COPY . .

# Expose a port for the application to listen on
EXPOSE 3000

# Start the Node.js application
CMD ["node", "index.js"]
