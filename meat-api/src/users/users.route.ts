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

  findByEmail = (req: Request, res: Response, next: NextFunction) => {
    const email = <string>req.query.email;

    console.log({ email });

    if (email) {
      User.find({ email }).then(this.render(res, next)).catch(next);
    } else {
      next();
    }
  };

  protected applyRoutes() {
    this._router.param("id", this.idValidator);

    this._router.get("/users", [this.findByEmail, this.findAll]);

    this._router.get("/users/:id", this.findById);

    this._router.post("/users", this.save);

    this._router.put("/users/:id", this.replace);

    this._router.patch("/users/:id", this.update);

    this._router.delete("/users/:id", this.delete);

    this._router.use(this.errorMiddleware);
  }
}
