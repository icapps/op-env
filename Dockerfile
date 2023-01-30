# Build
FROM node:18 as build
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

# Run
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY --from=build /app/dist .
EXPOSE $PORT
CMD [ "node", "index.js" ]