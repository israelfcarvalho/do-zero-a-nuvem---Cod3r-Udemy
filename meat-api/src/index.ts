import express, { Request, Response, NextFunction, ErrorRequestHandler } from "express";

const app = express();
const port = 3000;

const errorPlugin: ErrorRequestHandler = (error, req, res, next) => {
    res.json(error);
    console.log('error')

    return next(false);
}

const denyPostamanMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userAgent = req.headers["user-agent"];

  if (userAgent && userAgent.includes("PostmanRuntime/7.24.1")) {

    const error: any = {
        statusCode: 400,
        message: 'Postaman is not authorized to make requests to this API.'
    }

    return next(error);
  }

  return next();
};

app.use(errorPlugin);

app.use(denyPostamanMiddleware);

app.get("/info", (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("content-type", "application/json");
  res.send({
    message: "Hello World!",
    userAgent: req.headers["user-agent"],
    method: req.method,
    url: req.url,
    path: req.path,
    query: req.query,
    body: req.body
  });

  return next();
});

app.listen(port, () => {
  console.log(`Listen on port ${port}`);
});
