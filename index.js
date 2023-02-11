require('dotenv').config({ path: "../.env" })
const express = require('express');
const app = express();
const route = require('./app/routes/route');
var bodyParser = require('body-parser')
const middleware = require('./app/middleware/middleware');
const dbConnection = require('./app/helper/database/connection');
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

dbConnection.getConnection();
app.listen(PORT, () => {
    logger.info('index', `Server started on port ${PORT}`, 'start server');
})
