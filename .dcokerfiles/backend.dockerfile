FROM node:21-alpine as builder

WORKDIR /app

copy backend/packages.json ./

# Install the dependencies in the Docker image
RUN ["npm", "install", "--legacy--peer-deps"]

COPY backend/src ./src

# Build the application (another way of running commands!)
RUN npm run build

# Start a new stage to create a smaller final image
FROM node:21-alpine

WORKDIR /app

# Copy the node_modules and built files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# The docker command to run
CMD ["npm", "start"]