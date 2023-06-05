# Base image
FROM node:14

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port on which the server will listen
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
