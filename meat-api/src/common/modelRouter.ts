import Router from "./router";
import { Model, Document, isValidObjectId } from "mongoose";
import { RouterOptions, NextFunction, Request, Response } from "express";

abstract class ModelRouter<T extends Document> extends Router {
  private model: Model<T>;

  constructor(model: Model<T>, options?: RouterOptions) {
    super(options);

    this.model = model;
  }

  protected idValidator(req: Request, res: Response, next: NextFunction) {
    const _id = req.params.id;

    if (!isValidObjectId(_id)) {
      res.sendStatus(404);
    } else {
      next();
    }
  }

  private getPutUpdate(document: T) {
    const schemaFields = Object.keys(document.schema.obj);
    const unset: any = {};
    const update: any = { _id: document._id };

    schemaFields.forEach((schemaField) => {
      const isSet = !!document.get(schemaField);

      if (isSet) {
        update[schemaField] = document.get(schemaField);
      } else {
        unset[schemaField] = "";
      }
    });

    return {
      $unset: unset,
      ...update,
    };
  }

  protected findAll = (req: Request, res: Response, next: NextFunction) => {
    this.model.find().then(this.render(res, next)).catch(next);
  };

  protected findById = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    this.model
      .findById(id)
      .then(this.render(res, next))
      .catch((error) => next(error));
  };

  protected save = (req: Request, res: Response, next: NextFunction) => {
    const document = new this.model(req.body);

    document
      .save()
      .then(this.render(res, next))
      .catch((error) => next(error));
  };

  protected replace = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const document = new this.model({ _id, ...req.body });

    const update = this.getPutUpdate(document);

    this.model
      .findByIdAndUpdate(_id, update, {
        new: true,
        useFindAndModify: false,
        multipleCastError: true,
        runValidators: true,
      })
      .then(this.render(res, next))
      .catch((error) => next(error));
  };

  protected update = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const user = new this.model({ _id, ...req.body });

    this.model
      .findByIdAndUpdate(_id, user, {
        new: true,
        useFindAndModify: false,
        runValidators: true,
        multipleCastError: true,
      })
      .then(this.render(res, next))
      .catch((error) => next(error));
  };

  protected delete = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const document = new this.model({ _id });

    this.model
      .remove({ _id: document._id })
      .then((result) => {
        if (result.deletedCount) {
          res.json({ message: "User removido com sucesso!" });
        } else {
          res.status(404).json({ message: "User não encontrado!" });
        }
      })
      .catch((error) => next(error));
  };
}

export default ModelRouter;
