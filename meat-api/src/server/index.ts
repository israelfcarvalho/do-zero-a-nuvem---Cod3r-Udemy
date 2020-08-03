import express, { Application } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import { environment } from "../common/environment";
import UsersRoute from "../users/users.route";
import RestaurantsRoute from "../restaurants/restaurants.route";
import ReviewsRoute from "../reviews/reviews.route";

const usersRoute = new UsersRoute();
const restaurantsRoute = new RestaurantsRoute();
const reviewsRoute = new ReviewsRoute();

const routes = [usersRoute, restaurantsRoute, reviewsRoute].map((route) => ({
  route: route.router,
  path: route.basePath,
}));

export class Server {
  constructor() {
    this.application = express();
  }

  readonly application: Application;

  initRoutes(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application.use(bodyParser.urlencoded({ extended: false }));
        this.application.use(bodyParser.json());
        routes.forEach((route) => {
          this.application.use(route.route);
        });

        this.application.use((req, res, next) => {
          const message = `Route '${req.path}' does not exists. Below are the possible routes!`;
          const routesLinks = routes.map((route) => `${route.path}`);

          res.json({ message, routesLinks });
        });

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
      autoIndex: true,
    });
  }

  bootstrap(): Promise<Server> {
    return this.initDB().then(() => this.initRoutes().then(() => this));
  }
}
