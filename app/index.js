require('dotenv').config({ path: "../.env" })
const express = require('express');
const app = express();
const route = require('./routes/Route');
var bodyParser = require('body-parser')

const { MongoClient } = require('mongodb');
const BaseDao = require('./helper/BaseDao');

const PORT = 8000;

app.use(bodyParser.json());
app.use(route);


MongoClient.connect(
    process.env.DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).catch(err => {
    console.error(err.stack)
    process.exit()
}).then(async client => {
    await BaseDao.injectDB(client);
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    })
})
