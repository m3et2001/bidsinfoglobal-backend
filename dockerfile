FROM node:20.11.0-alpine
WORKDIR ./
COPY . .
RUN npm install
EXPOSE 5000
CMD ["node","app.js"]
