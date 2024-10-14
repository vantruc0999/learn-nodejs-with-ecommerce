"use strict";

const JWT = require("jsonwebtoken");

const { Unauthorized, NotFound } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");
const asyncHandler = require("../helpers/asyncHandler");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "x-rtoken-id",
};

const authentication = asyncHandler(async (req, res, next) => {
  /**
   * Check userId missing?
   * Get access token
   * verify token
   * check user in db
   * check keyStore with userId
   * return next()
   */

  const userId = req.headers[HEADER.CLIENT_ID];

  if (!userId) throw new Unauthorized("Unauthorized");

  const keyStore = await findByUserId(userId);

  if (!keyStore) throw new NotFound("keyStore not found");

  const accessToken = req.headers[HEADER.AUTHORIZATION];

  if (!accessToken) throw new Unauthorized("Unauthorized");

  const decodeUser = JWT.verify(accessToken, keyStore.publicKey);

  if (userId !== decodeUser.userId) throw new Unauthorized("Unauthorized");

  req.keyStore = keyStore;

  return next();
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];

  if (!userId) throw new Unauthorized("Unauthorized");

  const keyStore = await findByUserId(userId);

  if (!keyStore) throw new NotFound("keyStore not found");

  if (req.headers[HEADER.REFRESH_TOKEN]) {
    const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
    const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);

    if (userId !== decodeUser.userId) throw new Unauthorized("Unauthorized");

    req.user = decodeUser;
    req.keyStore = keyStore;
    req.refreshToken = refreshToken;
    return next();
  }
  
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  
  if (!accessToken) throw new Unauthorized("Unauthorized");
  
  const decodeUser = JWT.verify(accessToken, keyStore.publicKey);

  if (userId !== decodeUser.userId) throw new Unauthorized("Unauthorized");

  req.keyStore = keyStore;
  req.user = decodeUser;

  return next();
});

module.exports = {
  authentication,
  authenticationV2,
};
