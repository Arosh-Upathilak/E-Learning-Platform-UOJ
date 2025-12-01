# Development stage
FROM node:22-alpine as frontend

#define working directory in container
WORKDIR /app

# Copy pakage.json file to container
COPY package*.json ./


RUN npm install

# Copy all the files to container
COPY . .

# CMD ["npx","nodemon","index.js"]
CMD ["npm","start"]