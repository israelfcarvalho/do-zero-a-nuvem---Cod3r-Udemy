import { NextFunction, Response, Request, ErrorRequestHandler } from "express";
import { Error } from "mongoose";

import { User } from "../users/users.model";

type Document = User | User[] | null | undefined;

export const render = function (res: Response, next: NextFunction) {
  return (document: Document) => {
    if (document) {
      res.json(document);
    } else {
      res.send(404);
    }

    return next();
  };
};

const validationErrorParse = function (error: any) {
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
};

const mongoErrorParse = function (error: any) {
  const status = error.code === 11000 ? 400 : 500;

  return {
    error: error.message,
    status,
  };
};

const parseError = function (error: any) {
  console.log({ name: error.name });
  switch (error.name) {
    case "ValidationError": {
      return validationErrorParse(error);
    }

    case "MongoError": {
      return mongoErrorParse(error);
    }

    default: {
      return { error: "Something went wrong!!", status: 500 };
    }
  }
};

export const errorMiddleware: ErrorRequestHandler = function (
  error: any,
  req: Request,
  res: Response,

  next: NextFunction
) {
  console.error({ error });
  const parsedError = parseError(error);

  res.status(parsedError.status).json(parsedError.error);
};
