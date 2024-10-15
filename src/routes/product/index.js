"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const {
  authentication,
  authenticationV2,
} = require("../../middlewares/authentication");

const router = express.Router();

router.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct)
);
router.get("", asyncHandler(productController.getAllProducts));
router.get("/:product_id", asyncHandler(productController.getProduct));

router.use(authenticationV2);

router.post("", asyncHandler(productController.createProduct));
router.patch("/:product_id", asyncHandler(productController.updateProduct));
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
