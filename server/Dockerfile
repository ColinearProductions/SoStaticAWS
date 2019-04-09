FROM node:8
WORKDIR /app



ENV DB_ADDRESS=localhost:27017
ENV NODE_ENV production

COPY ./package*.json ./
RUN npm install
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]