FROM node:20
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
COPY --chown=node:node . .
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 3000
CMD [ "node", "./bin/www" ]