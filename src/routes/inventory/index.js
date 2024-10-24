"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/async-handler");
const inventoryController = require("../../controllers/inventory.controller");
const { authenticationV2 } = require("../../middlewares/authentication");

const router = express.Router();

router.use(authenticationV2)
router.post("/add-stock", asyncHandler(inventoryController.addStockToInventory));


module.exports = router;
