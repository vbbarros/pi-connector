FROM node:8-slim

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --production
# If you are building your code for production
# RUN npm ci --only=production

# RUN npm install -g yarn

COPY . .

ENV PORT 8080

EXPOSE 8080

# RUN yarn start
CMD [ "yarn", "start" ]