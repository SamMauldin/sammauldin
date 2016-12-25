FROM mhart/alpine-node:base-7

WORKDIR /
ADD . .

EXPOSE 3000
CMD ["node", "app.js"]
