# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY API/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY ./API/ .

# Expose the port the app runs on
EXPOSE 7070

# Define the command to run your app
CMD ["npm", "start"]

