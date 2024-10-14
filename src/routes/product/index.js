"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const {
  authentication,
  authenticationV2,
} = require("../../middlewares/authentication");

const router = express.Router();

router.get("/search/:keySearch", asyncHandler(productController.getListSearchProduct));


router.use(authenticationV2);

router.post("", asyncHandler(productController.createProduct));
router.post(
  "/published/:id",
  asyncHandler(productController.publishProductByShop)
);
router.post(
  "/unpublished/:id",
  asyncHandler(productController.unPublishProductByShop)
);

//Query
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishedForShop)
);

module.exports = router;
