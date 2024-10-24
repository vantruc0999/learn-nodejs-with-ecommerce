"use strict";

const express = require("express");
const authController = require("../../controllers/auth.controller");
const asyncHandler = require("../../helpers/async-handler");
const { authentication, authenticationV2 } = require("../../middlewares/authentication");


const router = express.Router();

router.post("/shop/signup", asyncHandler(authController.signUp));
router.post("/shop/login", asyncHandler(authController.login));

router.use(authenticationV2)
router.post("/shop/logout", asyncHandler(authController.logout));
router.post("/shop/handle-refresh-token", asyncHandler(authController.handleRefreshToken));

module.exports = router;
