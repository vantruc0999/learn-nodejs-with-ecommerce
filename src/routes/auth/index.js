"use strict";

const express = require("express");
const authController = require("../../controllers/auth.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../utils/jwt");

const router = express.Router();

router.post("/shop/signup", asyncHandler(authController.signUp));
router.post("/shop/login", asyncHandler(authController.login));

router.use(authentication)
router.post("/shop/logout", asyncHandler(authController.logout));

module.exports = router;
