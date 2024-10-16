"use strict";

const {
  Types: { ObjectId },
} = require("mongoose");
const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    // const tokens = await keyTokenModel.create({
    //   user: userId,
    //   publicKey,
    //   privateKey,
    // });
    // return tokens ? tokens.publicKey : null;

    const filter = { user: userId },
      update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      },
      options = {
        upsert: true,
        new: true,
      };

    const tokens = await keyTokenModel.findOneAndUpdate(
      filter,
      update,
      options
    );

    return tokens ? tokens.publicKey : null;
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: userId });
  };

  static removeTokenById = async (keyStore) => {
    const result = await keyTokenModel.deleteOne({
      _id: keyStore._id,
    });
    return result;
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };

  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId });
  };
}

module.exports = KeyTokenService;
