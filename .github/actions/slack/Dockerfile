FROM node:10

RUN npm install -g @slack/web-api

COPY entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]
