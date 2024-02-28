import mongoose from 'mongoose';
import { GlobalConfig } from '../config/globalConfig';

class MongoDatabase {

  constructor(config: GlobalConfig){
    this.connectToMongoDb(config);
  }

  private async connectToMongoDb(config: GlobalConfig) {        
    await mongoose.
      connect(config.MONGODB_URI)
      .then(() => {
        console.log('✅ MongoDb Connection has been established successfully.');   
      })
      .catch((err) => {
        console.error('❌ Unable to connect to the Mongodb database:', err);
      });
  }
}

export default MongoDatabase;