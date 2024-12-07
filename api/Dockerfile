# Use a Node.js base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .
COPY wait-for-it.sh /usr/local/bin/wait-for-it

# Expose the application port
EXPOSE 8080

# Command to run the application
CMD ["wait-for-it", "postgres:5432", "--", "npm", "start"]