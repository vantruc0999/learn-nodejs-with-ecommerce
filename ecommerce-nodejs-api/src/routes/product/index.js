"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/async-handler");
const {
  authentication,
  authenticationV2,
} = require("../../middlewares/authentication");
const { grantAccess } = require("../../middlewares/rbac.middleware");
const uploadController = require("../../controllers/upload.controller");
const { uploadDisk } = require("../../configs/multer.config");

const router = express.Router();

router.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct)
);
// router.get("", grantAccess('readAny', 'shop') ,asyncHandler(productController.getAllProducts));
router.get("", asyncHandler(productController.getAllProducts));
router.get("/:product_id", asyncHandler(productController.getProduct));
router.post("/upload", asyncHandler(uploadController.uploadFile))
router.post("/upload/thumb", uploadDisk.single('file'), asyncHandler(uploadController.uploadFileThumb))
router.post("/upload/multiple", uploadDisk.array('files', 3), asyncHandler(uploadController.uploadImageFromLocalFiles))

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
