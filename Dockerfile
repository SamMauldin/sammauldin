FROM mhart/alpine-node:base-6

WORKDIR /
ADD . .
RUN npm install

EXPOSE 3000
CMD ["node", "app.js"]
