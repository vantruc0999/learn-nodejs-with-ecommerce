"use strict";

const express = require("express");
const accessController = require("../../controllers/auth.controller");
const router = express.Router();
const { asyncHandler } = require("../../utils/checkAuth");

router.post("/shop/signup", asyncHandler(accessController.signUp));

module.exports = router;
