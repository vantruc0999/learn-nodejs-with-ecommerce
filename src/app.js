require("dotenv").config();
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const app = express();

//init middleware
//format outputs concise colored logs with details of requests: HTTP method, URL, status code, response time, content length.
app.use(morgan("dev"));
//is a middleware that adds security headers to protect Express.js app from common vulnerabilities like XSS and clickjacking
app.use(helmet());
//compresses HTTP responses to reduce data size and improve page load speed.
app.use(compression());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//init db
require("./databases/init.mongodb");
// const { countConnect, checkOverload } = require("./helpers/check.connect");
// checkOverload()
//init routes
app.use("/", require("./routes"));

//handling error
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: error.stack,
    message: error.message || "Internal Server Error"
  });
});
module.exports = app;
