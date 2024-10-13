"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const AuthService = require("../services/auth.service");
class AuthController {
  async signUp(req, res, next) {
    // return res.status(201).json(await AuthService.signUp(req.body));
    new CREATED({
      message: "Registered OK!",
      metadata: await AuthService.signUp(req.body),
    }).send(res);
  }

  async login(req, res, next) {
    new SuccessResponse({
      message: "Login OK!",
      metadata: await AuthService.login(req.body),
    }).send(res);
  }

  async logout(req, res, next) {
    new SuccessResponse({
      message: "Logout OK!",
      metadata: await AuthService.logout(req.keyStore),
    }).send(res);
  }

  async handleRefreshToken(req, res, next) {
    new SuccessResponse({
      message: "Get refresh token success",
      metadata: await AuthService.handleRefreshToken(req.body.refreshToken),
    }).send(res);
  }
}

module.exports = new AuthController();
