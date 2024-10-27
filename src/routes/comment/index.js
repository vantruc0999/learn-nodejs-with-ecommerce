"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/async-handler");
const commentController = require("../../controllers/comment.controller");

const router = express.Router();

router.post("", asyncHandler(commentController.createComment));
router.get("", asyncHandler(commentController.getCommentByParentId));
router.delete("", asyncHandler(commentController.deleteComment));

module.exports = router;
