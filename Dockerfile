# Use Node.js 18 image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 8080

# Start the server
CMD ["node", "index.js"]
