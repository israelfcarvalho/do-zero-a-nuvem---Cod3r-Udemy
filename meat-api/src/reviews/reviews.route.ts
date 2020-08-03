import { RouterOptions, Request, Response, NextFunction } from "express";

import ModelRouter from "../common/modelRouter";
import Review, { ReviewDocument } from "./reviews.model";
import { DocumentQuery, Types } from "mongoose";
import { type } from "os";

class ReviewsRoute extends ModelRouter<ReviewDocument> {
  constructor(options?: RouterOptions) {
    super(Review, options);

    this.applyRoutes();
  }

  get router() {
    return this._router;
  }

  protected envelope(document: ReviewDocument) {
    const _document = super.envelope(
      document.depopulate("restaurant").depopulate("user")
    );

    const restaurantId = document.restaurant;
    const userId = document.user;

    _document._links.restaurants = `/restaurants/${restaurantId}`;
    _document._links.user = `/users/${userId}`;

    return _document;
  }

  protected prepareOne(
    query: DocumentQuery<ReviewDocument | null, ReviewDocument, {}>
  ) {
    return query
      .populate("restaurant", "-_id -__v")
      .populate("user", "-_id -__v");
  }

  protected applyRoutes() {
    this._router.param("id", this.idValidator);

    this._router.get(`${this.basePath}`, this.findAll);

    this._router.get(`${this.basePath}/:id`, this.findById);

    this._router.post(`${this.basePath}`, this.save);

    this._router.delete(`${this.basePath}/:id`, this.delete);

    this._router.use(this.errorMiddleware);
  }
}

export default ReviewsRoute;
