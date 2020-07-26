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
      errorObject.error[key] = errors[key].properties.message;
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

  protected render(res: Response, next: NextFunction) {
    return (document: Document | Document[] | null) => {
      if (document) {
        res.json(document);
      } else {
        res.send(404);
      }

      return next();
    };
  }
}

export default Router;
