"use strict";

const AuthService = require("../services/auth.service");

class AuthController {
  async signUp(req, res, next) {
    try {
      console.log(`[P]::signUp::`, req.body);
      const result = await AuthService.signUp(req.body); 
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
