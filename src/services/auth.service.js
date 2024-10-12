"use strict";

const { status } = require("express/lib/response");
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../utils/jwt");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  ConflictRequestError,
  Unauthorized,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AuthService {
  static login = async ({ email, password, refreshToken = null }) => {
    const shop = await findByEmail({ email });

    if (!shop) throw new BadRequestError("Shop not registered");

    const match = await bcrypt.compare(password, shop.password);

    if (!match) throw new Unauthorized("Unathorized");

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const { _id: userId } = shop;
    const tokens = await createTokenPair(
      { userId: shop._id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId,
    });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: shop,
      }),
      tokens,
    };
  };

  static logout = async ( keyStore ) => {
    const delKey = await KeyTokenService.removeTokenById(keyStore._id);
    console.log(delKey);
    return delKey;
  };

  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      throw new ConflictRequestError("Shop already registered");
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });

      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("keyStore error");
      }

      //created token pairs
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      return {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AuthService;
