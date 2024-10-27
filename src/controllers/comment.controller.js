"use strict"

const { CREATED, SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: "Create comment successfully",
            metadata: await CommentService.createComment({ ...req.body }),
        }).send(res);
    };

    getCommentByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: "Get comments successfully",
            metadata: await CommentService.getCommentByParentId(req.query),
        }).send(res);
    };

    deleteComment = async (req, res, next) => {
        new SuccessResponse({
            message: "Delete comment successfully",
            metadata: await CommentService.deleteComment(req.query),
        }).send(res);
    };
}

module.exports = new CommentController()

