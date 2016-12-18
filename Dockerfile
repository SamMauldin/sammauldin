FROM mhart/alpine-node:7

WORKDIR /
ADD . .
RUN npm install

EXPOSE 3000
CMD ["node", "app.js"]
