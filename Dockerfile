# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

ENV NODE_ENV=local

# Expose the port your app runs on
EXPOSE 3000
EXPOSE 5000
EXPOSE 5555



# Command to run the server
CMD ["npm", "run", "linux"]
