require('dotenv').config({ path: "../.env" })
const express = require('express');
const app = express();
const route = require('./routes/Route');
var bodyParser = require('body-parser')
const middleware = require('./middleware/Middleware');
const { MongoClient } = require('mongodb');
const BaseDao = require('./helper/BaseDao');

const PORT = 8000;

app.use(bodyParser.json());
app.use(middleware);
app.use('/api', route);
app.use('*', function (req, res) {
    res.status(404).json({ status: false, message: 'page not found' });
});

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
