require('dotenv').config();
const confidence = require('confidence');

const config = {
    env: process.env.ENV,
    port: process.env.PORT,
    mongodbURL: process.env.MONGODB_URI
}

const store = new confidence.Store(config);

exports.get = key => store.get(key);
