# Use an official Node.js runtime as a parent image
FROM node:14

#RUN apt-get update && \
#    apt-get install -y python3 build-essential && \
#    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY WEB/package*.json ./

# Install dependencies
RUN npm install
#RUN npm run-script

# Copy the rest of the application files
COPY ./WEB/ .

# Expose the port the app runs on
EXPOSE 8080

# Define the command to run your app
CMD ["npm", "start", "debug"]

