import { Sequelize } from 'sequelize-typescript';
import { Note } from '../../domain/notes/schemas/Model';
import { GlobalConfig } from '../config/globalConfig';
import { User } from '../../domain/users/schemas/Model';


class Database {
  public sequelize: Sequelize | undefined;


  constructor(config: GlobalConfig) {
    this.connectToPostgreSQL(config);
  }

  private async connectToPostgreSQL(config: GlobalConfig) {
    this.sequelize = new Sequelize({
      database: config.POSTGRES_DB,
      username: config.POSTGRES_USER,
      password: config.POSTGRES_PASSWORD,
      host: config.POSTGRES_HOST,
      port: config.POSTGRES_PORT,
      dialect: 'postgres',
      models:[Note, User]
    });

    await this.sequelize
      .authenticate()
      .then(() => {
        console.log(
          '✅ PostgreSQL Connection has been established successfully.'
        );
      })
      .catch((err) => {
        console.error('❌ Unable to connect to the PostgreSQL database:', err);
      });
  }
}

export default Database;