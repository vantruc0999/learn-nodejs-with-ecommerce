"use strict";

const express = require("express");
const cartController = require("../../controllers/cart.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../middlewares/authentication");

const router = express.Router();
console.log('hehe');
router.get("", asyncHandler(cartController.getCartList));
router.post("", asyncHandler(cartController.addToCart));
router.delete("", asyncHandler(cartController.deleteCart));
router.post("/update", asyncHandler(cartController.updateCart));

module.exports = router;
