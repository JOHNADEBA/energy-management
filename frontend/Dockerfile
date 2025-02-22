# Use the official Node.js image from the Docker Hub
FROM node:20-slim

# Set the working directory
WORKDIR /frontend

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the frontend application code
COPY . .

# Add environment variables
ARG NEXT_PUBLIC_API_URL

# Set environment variables
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the Next.js application 
RUN npm run build

# Expose the port that the frontend app runs on
EXPOSE 3000

# Run the Next.js app
# for prod
# CMD ["npm", "start"]

# for dev
CMD ["npm", "run", "dev"]
