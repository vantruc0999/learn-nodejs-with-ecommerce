"use strict";

const {
  Types: { ObjectId },
} = require("mongoose");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    // const tokens = await keytokenModel.create({
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

    const tokens = await keytokenModel.findOneAndUpdate(
      filter,
      update,
      options
    );

    return tokens ? tokens.publicKey : null;
  };

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: userId }).lean();
  };

  static removeTokenById = async (keyStore) => {
    const result = await keytokenModel.deleteOne({
      _id: keyStore._id,
    });
    return result;
  };
}

module.exports = KeyTokenService;
