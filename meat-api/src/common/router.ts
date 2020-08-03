import {
  Router as expressRouter,
  NextFunction,
  Response,
  Request,
  RouterOptions,
} from "express";
import { Document } from "mongoose";

abstract class Router {
  protected _router: expressRouter;

  constructor(options?: RouterOptions) {
    this._router = expressRouter(options);

    this.applyRoutes = this.applyRoutes.bind(this);
  }

  protected abstract applyRoutes(): void;

  private validationErrorParse(error: any) {
    const errors = error.errors;
    const errorKeys = Object.keys(error.errors);
    const errorObject: any = { error: {} };

    errorKeys.forEach((key) => {
      if (errors[key].name === "ValidatorError") {
        errorObject.error[key] = errors[key].properties.message;
      } else {
        errorObject.error[key] = errors[key].message;
      }
    });

    return {
      error: errorObject,
      status: 400,
    };
  }

  private mongoErrorParse(error: any) {
    const status = error.code === 11000 ? 400 : 500;

    return {
      error: error.message,
      status,
    };
  }

  private parseError = (error: any) => {
    switch (error.name) {
      case "ValidationError": {
        return this.validationErrorParse(error);
      }

      case "MongoError": {
        return this.mongoErrorParse(error);
      }

      default: {
        return { error: "Something went wrong!!", status: 500 };
      }
    }
  };

  protected errorMiddleware = (
    error: any,
    req: Request,
    res: Response,

    next: NextFunction
  ) => {
    console.error({ error });
    const parsedError = this.parseError(error);

    res.status(parsedError.status).json(parsedError.error);
  };

  protected envelope(document: Document) {
    return document;
  }

  protected renderAll(res: Response, next: NextFunction) {
    return (documents: Array<Document>) => {
      const _documents = documents.map((document) => {
        return this.envelope(document);
      });

      res.json(_documents);
    };
  }

  protected render(res: Response, next: NextFunction) {
    return (document: Document | null) => {
      if (document) {
        res.json(this.envelope(document));
      } else {
        res.send(404);
      }
    };
  }
}

export default Router;
