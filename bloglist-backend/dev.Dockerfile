
FROM node:16
WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN npm install
ENV DEBUG=bloglist-backend:*
USER node
CMD npm run dev