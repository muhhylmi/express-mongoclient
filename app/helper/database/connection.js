const { MongoClient }  = require('mongodb');
const config = require('../../config/config');
const logger = require('../../helper/logger');
let dbConn;
const createConnection = () => {
    const ctx = 'helper-createConnection';
    try {
        const client = new MongoClient(config.get('/mongodbURL'),
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        client.connect().then( mongo => {
            dbConn = mongo.db(process.env.DB_NAME)
        })
    } catch (e) {
        logger.error(ctx, 'Failed to get mongodb connection', 'getMongoDB', '');
    }
}

const getConnection = () => {
    if(!dbConn){
        createConnection();
    }
    return dbConn;
}


module.exports = {
    createConnection,
    getConnection
};


