# Stage 1: Build the application
FROM node:18 AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

RUN npm install

# Copy the rest of the application
COPY . .

# Build the application for browser
RUN npm run build

# Stage 2: Setup the runtime
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the built application from build stage
COPY --from=build /app/dist /app/dist


# Expose port 4000
EXPOSE 4000

# Start the server
CMD ["npm", "run", "serve:ssr:CoreConnect"]