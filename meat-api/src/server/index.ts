import express, { Application } from "express";
import bodyParser from 'body-parser';
import userRoute from '../users/users.route';
import {environment} from '../common/environment';
import mongoose from "mongoose";

export class Server {
  constructor() {
    this.application = express();
  }

  readonly application: Application;

  initRoutes(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application.use(bodyParser.urlencoded({extended: false}))
        this.application.use(bodyParser.json())
        this.application.use(userRoute)

        this.application.listen(environment.server.port, () => {
          resolve(this.application);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  initDB() {
    return mongoose.connect(environment.db.url, {
      dbName: environment.db.name,
      user: environment.db.user,
      pass: environment.db.password,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      autoIndex: true
    })
  }

  bootstrap(): Promise<Server> {
    return this.initDB().then(() => this.initRoutes().then(() => this));
  }
}
