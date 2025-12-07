<<<<<<< HEAD
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN mkdir -p /app/logs

EXPOSE 3000

=======
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN mkdir -p /app/logs

EXPOSE 3000

>>>>>>> 0297ea5f8ee57a0f9309fdbe4ac3d6f35bbafdbb
CMD ["npm", "start"]