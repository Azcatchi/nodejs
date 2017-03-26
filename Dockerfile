FROM node:mongoose

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

USER node
EXPOSE 8884
CMD [ "npm", "start" ]
