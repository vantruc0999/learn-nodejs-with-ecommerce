"use strict";

const ReasonPhrases = require("../utils/reasonPhrases");
const StatusCode = require("../utils/statusCode");

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.CONFLICT,
    statusCode = StatusCode.CONFLICT
  ) {
    super(message);
    this.status = statusCode;
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.BAD_REQUEST,
    statusCode = StatusCode.BAD_REQUEST
  ) {
    super(message);
    this.status = statusCode;
  }
}

class Unauthorized extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    statusCode = StatusCode.UNAUTHORIZED
  ) {
    super(message);
    this.status = statusCode;
  }
}

class NotFound extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    statusCode = StatusCode.NOT_FOUND
  ) {
    super(message);
    this.status = statusCode;
  }
}

class Forbidden extends ErrorResponse {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message);
    this.status = statusCode;
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  Unauthorized,
  NotFound,
  Forbidden
};
