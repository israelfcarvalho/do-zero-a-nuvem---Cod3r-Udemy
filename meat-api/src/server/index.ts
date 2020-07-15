import express, { Application, Request, Response, NextFunction, Router} from "express";
import userRoute from '../users/users.route';
import {environment} from '../common/environment';

export class Server {
  constructor() {
    this.application = express();
  }

  readonly application: Application;

  initRoutes(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application.use(userRoute)

        this.application.listen(environment.server.port, () => {
          resolve(this.application);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  bootstrap(): Promise<Server> {
    return this.initRoutes().then(() => this);
  }
}
