"use strict";

const express = require("express");
const checkoutController = require("../../controllers/checkout.controller");
const asyncHandler = require("../../helpers/async-handler");

const router = express.Router();

router.post("/review", asyncHandler(checkoutController.checkoutReview));
router.post("/order", asyncHandler(checkoutController.orderByUser));

module.exports = router;
