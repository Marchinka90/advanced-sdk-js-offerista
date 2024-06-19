FROM node:22-alpine

WORKDIR /usr/src/app

COPY src ./src
COPY example ./example
COPY dist ./dist
COPY package*.json ./
COPY .babelrc ./ 
COPY webpack.config.js ./

RUN npm install
RUN npm run build

RUN npm install -g http-server

WORKDIR /usr/src/server

COPY server/controllers ./controllers
COPY server/middleware ./middleware
COPY server/routes ./routes
COPY server/package*.json ./
COPY server/db.json ./
COPY server/config.js ./
COPY server/server.js ./

RUN npm install

EXPOSE 8080

EXPOSE 5000

CMD ["sh", "-c", "http-server /usr/src/app/dist & node /usr/src/server/server.js"]
