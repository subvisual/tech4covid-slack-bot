FROM node:10

COPY package-lock.json package.json entrypoint.sh .
RUN npm install

ENTRYPOINT ["/entrypoint.sh"]
