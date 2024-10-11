"use strict";

const { CREATED } = require("../core/success.response");
const AuthService = require("../services/auth.service");
class AuthController {
  async signUp(req, res, next) {
    // return res.status(201).json(await AuthService.signUp(req.body));
    new CREATED({
      message: "Registered OK!",
      metadata: await AuthService.signUp(req.body),
    }).send(res);
  }
}

module.exports = new AuthController();
