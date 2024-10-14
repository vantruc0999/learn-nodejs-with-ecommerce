"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../middlewares/authentication");

const router = express.Router();

router.use(authenticationV2);

router.post("", asyncHandler(productController.createProduct));

module.exports = router;
