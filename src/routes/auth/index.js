"use strict";

const express = require("express");
const authController = require("../../controllers/auth.controller");
const router = express.Router();
const { asyncHandler } = require("../../utils/checkAuth");

router.post("/shop/signup", asyncHandler(authController.signUp));
router.post("/shop/login", asyncHandler(authController.login));

module.exports = router;
