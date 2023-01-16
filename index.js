require('dotenv').config({ path: "../.env" })
const express = require('express');
const app = express();
const route = require('./app/routes/Route');
var bodyParser = require('body-parser')
const middleware = require('./app/middleware/Middleware');
const { MongoClient } = require('mongodb');
const BaseDao = require('./app/helper/DatabaseHelper');
const config = require('./app/config/config');
const logger = require('./app/helper/logger');
const PORT = config.get('/port');

logger.enableLogging();

app.use(bodyParser.json());
app.use(middleware);
app.use('/api', route);
app.use('*', function (req, res) {
    res.status(404).json({ status: false, message: 'page not found' });
});

MongoClient.connect(
    config.get('/mongodbURL'),
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).catch(err => {
    logger.error('index', err.message, 'mongodbConnect')
    process.exit()
}).then(async client => {
    await BaseDao.injectDB(client);
    app.listen(PORT, () => {
        logger.info('index', `Server started on port ${PORT}`, 'start server');
    })
})
