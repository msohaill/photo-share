FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm ci
RUN npm install serve -g

COPY . .

EXPOSE 3000

RUN npm run build
CMD ["serve", "-s", "./build"]