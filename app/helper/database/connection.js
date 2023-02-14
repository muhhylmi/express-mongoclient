const { MongoClient }  = require('mongodb');
const config = require('../../config/config');
const mongoHost = config.get('/mongoHost');
const mongoPort = config.get('/mongoPort');

let dbConn;

const createConnection = async () => {
  const url = `mongodb://${mongoHost}:${mongoPort}/express-mongo`;
  const client = new MongoClient(url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  const mongo = await client.connect();
  dbConn = mongo.db(process.env.DB_NAME);

};

const getConnection = async () => {
  if(!dbConn){
    await createConnection();
  }
  return dbConn;
};


module.exports = {
  createConnection,
  getConnection
};


