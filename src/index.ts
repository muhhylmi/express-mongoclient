import express, { Application, Request, Response } from 'express';
import Database from './helper/db/postgres';
import { config } from './helper/config/globalConfig';
import UserHandler from './domain/users/handlers/Handler';
import NoteHandler from './domain/notes/handlers/Handler';
import MongoDatabase from './helper/db/mongodb';
import initEvent from './domain/initEvent';


class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.plugins();
    this.databaseSync();
    this.mongoDbSync();
    this.routes();
    this.kafkaSync();
  }

  protected plugins(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  protected databaseSync(): void {
    const db = new Database(config);
    db.sequelize?.sync();
  }

  protected mongoDbSync(): void {
    new MongoDatabase(config);
  }

  protected kafkaSync(): void {
    initEvent();
  }

  protected routes(): void {
    this.app.route('/').get((req: Request, res: Response) => {
      res.send('welcome home');
    });
    this.app.use('/api/v1/notes', NoteHandler);
    this.app.use('/api/v1/users', UserHandler);
  }
}

const port: number | undefined = config.HOST_PORT;
const app = new App().app;

app.listen(port, () => {
  console.log('✅ Server started successfully on port:', port);
});