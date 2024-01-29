# Stage 1: Build Stage
FROM node:14 as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production Stage
FROM node:14-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/build ./build

RUN npm install --production

EXPOSE 3000

CMD ["node", "build/index.js"]
