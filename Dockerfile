# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app/

# install app dependencies
COPY package.json ./
COPY .npmrc ./

RUN npm install --silent
RUN npm install react-scripts -g --silent

# add app
COPY . ./

# start app
CMD ["npm", "start"]