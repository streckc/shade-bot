FROM node:10

WORKDIR /usr/src/app

ENV TZ=US/Central
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY package*.json ./

RUN npm install -g nodemon
RUN npm install

COPY . .

CMD [ "npm", "start" ]

