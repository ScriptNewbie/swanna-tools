FROM node:22-alpine
RUN adduser -D appuser
USER appuser
WORKDIR /app
COPY package-lock.json package.json .
RUN npm ci
COPY index.js .
CMD ["node", "index.js"]