FROM node:10.19.0
MAINTAINER Sumsar <smanovkutman@gmail.com>

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install
#RUN npm rebuild sharp --update-binary


# Bundle app source
COPY . /usr/src/app

EXPOSE 8088


CMD [ "npm", "run", "dev" ]