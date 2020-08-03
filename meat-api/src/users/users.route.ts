import { RouterOptions, Request, Response, NextFunction } from "express";

import ModelRouter from "../common/modelRouter";
import User, { UserDocument } from "./users.model";

export default class UserRoute extends ModelRouter<UserDocument> {
  constructor(options?: RouterOptions) {
    super(User, options);

    this.applyRoutes();
  }

  get router() {
    return this._router;
  }

  private findAllByEmail = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const email = <string>req.query.email;

    if (email) {
      User.findByEmail(email)
        .then((user) => (user ? [user] : []))
        .then(this.renderAll(res, next))
        .catch(next);
    } else {
      next();
    }
  };

  protected applyRoutes() {
    this._router.param("id", this.idValidator);

    this._router.get(`${this.basePath}`, [this.findAllByEmail, this.findAll]);

    this._router.get(`${this.basePath}/:id`, this.findById);

    this._router.post(`${this.basePath}`, this.save);

    this._router.put(`${this.basePath}/:id`, this.replace);

    this._router.patch(`${this.basePath}/:id`, this.update);

    this._router.delete(`${this.basePath}/:id`, this.delete);

    this._router.use(this.errorMiddleware);
  }
}
