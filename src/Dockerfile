# Author : Felix Jacob 

FROM node:14.17.0

WORKDIR /app/frontend
ENV PATH /app/node_modules/.bin:$PATH
COPY ./frontendAstronomer/package.json /app/frontend/package.json
RUN npm install
RUN npm install -g @angular/cli@7.3.9
COPY ./frontendAstronomer /app/frontend/

WORKDIR /app/Userservice
COPY ./Userservice/package.json /app/Userservice/package.json
RUN npm install 
COPY ./Userservice /app/Userservice/

WORKDIR /app
COPY startFrontendAndFavoritesBackend.sh /app/startFrontendAndFavoritesBackend.sh
RUN chmod +x startFrontendAndFavoritesBackend.sh
CMD ./startFrontendAndFavoritesBackend.sh