# Use the official Node.js 14 image as the base image
FROM node:14

# Create and set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY RealtimeColl/package*.json ./RealtimeColl/

# Install npm dependencies
RUN cd RealtimeColl && npm install

# Copy the rest of the application code
COPY RealtimeColl/src ./src

# Expose the port on which your app runs
EXPOSE 3000

# Command to run when starting the container
CMD ["node", "src/app.js"]

