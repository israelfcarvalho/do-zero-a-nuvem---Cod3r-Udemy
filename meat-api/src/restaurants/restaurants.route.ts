import { RouterOptions, NextFunction, Response, Request } from "express";

import ModelRouter from "../common/modelRouter";

import Restaurant, { RestaurantDocument } from "./restaurants.model";

export default class RestaurantRoute extends ModelRouter<RestaurantDocument> {
  constructor(options?: RouterOptions) {
    super(Restaurant, options);

    this.applyRoutes();
  }

  get router() {
    return this._router;
  }

  private findMenu(req: Request, res: Response, next: NextFunction) {
    const _id = req.params.id;

    Restaurant.findById(_id, "+menu")
      .then((restaurant) => {
        if (!restaurant) {
          next("Restaurant not found!");
        } else {
          res.json(restaurant.menu);
        }
      })
      .catch(next);
  }

  private replaceMenu(req: Request, res: Response, next: NextFunction) {
    const _id = req.params.id;

    Restaurant.findById(_id)
      .then((restaurant) => {
        if (!restaurant) {
          next("Restaurant not found!");
        } else {
          restaurant.menu = req.body;
          return restaurant.save();
        }
      })
      .then((restaurant) => {
        if (!restaurant) {
          next("Restaurant not found!");
        } else {
          res.json(restaurant.menu);
        }
      })
      .catch(next);
  }

  protected applyRoutes() {
    this._router.param("id", this.idValidator);

    this._router.get("/restaurants", this.findAll);

    this._router.get("/restaurants/:id", this.findById);

    this._router.post("/restaurants", this.save);

    this._router.put("/restaurants/:id", this.replace);

    this._router.patch("/restaurants/:id", this.update);

    this._router.delete("/restaurants/:id", this.delete);

    this._router.get("/restaurants/:id/menu", this.findMenu);

    this._router.put("/restaurants/:id/menu", this.replaceMenu);

    this._router.use(this.errorMiddleware);
  }
}
