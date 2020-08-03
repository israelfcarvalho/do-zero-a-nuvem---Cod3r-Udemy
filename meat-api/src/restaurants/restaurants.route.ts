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

  protected envelope(document: RestaurantDocument) {
    const _document = super.envelope(document);

    _document._links.menu = `${this.basePath}/${document._id}/menu`;

    return _document;
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

    this._router.get(`${this.basePath}`, this.findAll);

    this._router.get(`${this.basePath}/:id`, this.findById);

    this._router.post(`${this.basePath}`, this.save);

    this._router.put(`${this.basePath}/:id`, this.replace);

    this._router.patch(`${this.basePath}/:id`, this.update);

    this._router.delete(`${this.basePath}/:id`, this.delete);

    this._router.get(`${this.basePath}/:id/menu`, this.findMenu);

    this._router.put(`${this.basePath}/:id/menu`, this.replaceMenu);

    this._router.use(this.errorMiddleware);
  }
}
