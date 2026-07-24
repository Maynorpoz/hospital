FROM node:18-alpine
WORKDIR /app
RUN npm install -g @angular/cli
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
