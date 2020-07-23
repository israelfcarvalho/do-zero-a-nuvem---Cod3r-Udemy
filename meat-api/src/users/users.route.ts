import { Request, Response, NextFunction, RouterOptions } from "express";

import Router from "../common/router";
import User from "./users.model";

export default class UserRoute extends Router {
  constructor(options?: RouterOptions) {
    super(options);

    this.applyRoutes();
  }

  get router() {
    return this._router;
  }

  applyRoutes() {
    this._router.use(this.errorMiddleware);

    this._router.get(
      "/users",
      (req: Request, res: Response, next: NextFunction) => {
        User.find().then(this.render(res, next)).catch(next);
      }
    );

    this._router.get(
      "/users/:id",
      (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;

        User.findById(id)
          .then(this.render(res, next))
          .catch((error) => next(error));
      }
    );

    this._router.post(
      "/users",
      (req: Request, res: Response, next: NextFunction) => {
        const user = new User(req.body);

        user
          .save()
          .then(this.render(res, next))
          .catch((error) => next(error));
      }
    );

    this._router.put(
      "/users/:id",
      (req: Request, res: Response, next: NextFunction) => {
        const _id = req.params.id;
        const user = new User({ _id, ...req.body });

        const update = user.getPutUpdate();

        User.findByIdAndUpdate(_id, update, {
          new: true,
          useFindAndModify: false,
          multipleCastError: true,
          runValidators: true,
        })
          .then(this.render(res, next))
          .catch((error) => next(error));
      }
    );

    this._router.patch(
      "/users/:id",
      (req: Request, res: Response, next: NextFunction) => {
        const _id = req.params.id;
        const user = new User({ _id, ...req.body });

        User.findByIdAndUpdate(_id, user, {
          new: true,
          useFindAndModify: false,
          runValidators: true,
          multipleCastError: true,
        })
          .then(this.render(res, next))
          .catch((error) => next(error));
      }
    );

    this._router.delete(
      "/users/:id",
      (req: Request, res: Response, next: NextFunction) => {
        const _id = req.params.id;

        User.remove({ _id })
          .then((result) => {
            if (result.deletedCount) {
              res.json({ message: "User removido com sucesso!" });
            } else {
              res.status(404).json({ message: "User não encontrado!" });
            }
          })
          .catch((error) => next(error));
      }
    );
  }
}
