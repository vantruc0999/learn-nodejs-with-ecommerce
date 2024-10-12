"use strict";

const { ReasonPhrases } = require("../utils/reasonPhrases");
const { StatusCodes } = require("../utils/statusCode");

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.CONFLICT,
    statusCode = StatusCodes.CONFLICT
  ) {
    super(message);
    this.status = statusCode;
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.BAD_REQUEST,
    statusCode = StatusCodes.BAD_REQUEST
  ) {
    super(message);
    this.status = statusCode;
  }
}

class Unauthorized extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    statusCode = StatusCodes.UNAUTHORIZED
  ) {
    super(message);
    this.status = statusCode;
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  Unauthorized,
};
