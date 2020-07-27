import { RouterOptions, Request, Response, NextFunction } from "express";

import ModelRouter from "../common/modelRouter";
import Review, { ReviewDocument } from "./reviews.model";
import Restaurant from "../restaurants/restaurants.model";
import User from "../users/users.model";

class ReviewsRoute extends ModelRouter<ReviewDocument> {
  constructor(options?: RouterOptions) {
    super(Review, options);

    this.applyRoutes();
  }

  get router() {
    return this._router;
  }

  protected applyRoutes() {
    this._router.param("id", this.idValidator);

    this._router.get("/reviews", this.findAll);

    this._router.get("/reviews/:id", this.findById);

    this._router.post("/reviews", this.save);

    this._router.delete("/reviews/:id", this.delete);

    this._router.use(this.errorMiddleware);
  }
}

export default ReviewsRoute;
