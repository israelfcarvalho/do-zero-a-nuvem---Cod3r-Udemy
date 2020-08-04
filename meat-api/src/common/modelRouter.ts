import Router, { envelopeAllOptions, EnvelopeAllWrapper } from "./router";
import { Model, Document, isValidObjectId, DocumentQuery } from "mongoose";
import { RouterOptions, NextFunction, Request, Response } from "express";

abstract class ModelRouter<T extends Document> extends Router {
  private model: Model<T>;
  private pageSize = 4;
  public basePath: string;

  constructor(model: Model<T>, options?: RouterOptions) {
    super(options);

    this.model = model;
    this.basePath = `/${model.collection.name}`;
  }

  protected envelope(document: T) {
    const _links = {
      self: `${this.basePath}/${document._id}`,
    };
    const _document = { _links, ...document.toJSON() };

    return _document;
  }

  protected envelopeAll(documents: Array<T>, options: envelopeAllOptions) {
    const { page, count, _links } = options;

    if (page) {
      const nextPage = page + 1;
      const previousPage = page - 1;

      if (page * this.pageSize < count) {
        _links.next = `${this.basePath}?page=${nextPage}`;
      }

      if (previousPage > 0) {
        _links.previous = `${this.basePath}?page=${previousPage}`;
      }
    }

    return {
      ...options,
      _links,
      itens: documents,
    };
  }

  protected prepareOne(query: DocumentQuery<T | null, T, {}>) {
    return query;
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
    const url = req.url;
    const page = parseInt(<string>req.query.page) || 1;
    const _page = page > 0 ? page : 1;

    const skip = (_page - 1) * this.pageSize;

    this.model
      .countDocuments({})
      .then((count) => {
        const isInvalidPage = (page - 1) * this.pageSize >= count;

        if (isInvalidPage) {
          const hasIncompletePages = count % this.pageSize !== 0;
          const fullPages = Math.floor(count / this.pageSize);
          const lastValidPage = hasIncompletePages ? fullPages + 1 : fullPages;

          res.status(400).json({
            message: "Invalid page!!",
            itensCount: count,
            pageSize: this.pageSize,
            lastValidPage,
          });
        } else {
          this.model
            .find()
            .skip(skip)
            .limit(this.pageSize)
            .then(
              this.renderAll(res, next, { page, count, _links: { self: url } })
            );
        }
      })
      .catch(next);
  };

  protected findById = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    this.prepareOne(this.model.findById(id))
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
