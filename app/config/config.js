require('dotenv').config();
const confidence = require('confidence');

const config = {
  env: process.env.ENV,
  port: process.env.PORT,
  mongoHost: process.env.MONGO_HOST,
  mongoPort: process.env.MONGO_PORT,
  privateKeyJwt: process.env.PRIVATE_KEY_JWT
};

const store = new confidence.Store(config);

exports.get = key => store.get(key);
