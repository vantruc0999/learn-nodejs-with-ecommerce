"use strict";

const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { Unauthorized, NotFound } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    //refreshToken
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log("error verify::", err);
      } else {
        console.log("decode verify::", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (err) {
    console.log(err);
  }
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

module.exports = {
  createTokenPair,
  authentication,
};
