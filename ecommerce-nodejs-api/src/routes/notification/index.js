"use strict";

const express = require("express");
const notificationController = require("../../controllers/notification.controller")
const asyncHandler = require("../../helpers/async-handler");

const router = express.Router();

router.get("", asyncHandler(notificationController.listNotiByUser));

module.exports = router;