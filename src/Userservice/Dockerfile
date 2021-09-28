# Author : Felix Jacob 

FROM node:14.17.0

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
RUN npm install

COPY . /app/

CMD npm start