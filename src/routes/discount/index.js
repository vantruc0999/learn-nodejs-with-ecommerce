"use strict";

const express = require("express");
const discountController = require("../../controllers/discount.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../middlewares/authentication");

const router = express.Router();

router.get("/amount", asyncHandler(discountController.getAllDiscountAmount));
router.get(
  "/list-product-code",
  asyncHandler(discountController.getAllDiscountCodesWithProducts)
);

router.use(authenticationV2);

router.post("", asyncHandler(discountController.createDiscountCode));
router.get("", asyncHandler(discountController.getAllDiscountCodes));

module.exports = router;
