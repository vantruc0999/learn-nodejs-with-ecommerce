"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
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
    console.log(tokens ? tokens.publicKey : "haha");
    return tokens ? tokens.publicKey : null;
  };
}

module.exports = KeyTokenService;
