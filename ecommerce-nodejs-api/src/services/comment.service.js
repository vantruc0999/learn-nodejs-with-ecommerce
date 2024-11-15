"use strict";

const { NotFound } = require("../core/error.response");
const Comment = require("../models/comment.model");
const CommentRepository = require("../repositories/comment.repository");
const { getProductById } = require("../repositories/product.repository");

class CommentService {
    static async createComment({ productId, userId, content, parentCommentId }) {
        const comment = new Comment({
            commentProductId: productId,
            commentUserId: userId,
            commentContent: content,
            commentParentId: parentCommentId
        });

        let rightValue;

        if (parentCommentId) {
            const parentComment = await CommentRepository.findById(parentCommentId);

            if (!parentComment) throw new NotFound('parent comment not found');

            rightValue = parentComment.commentRight;

            await CommentRepository.updateMany(
                { commentProductId: productId, commentRight: { $gte: rightValue } },
                { $inc: { commentRight: 2 } }
            );

            await CommentRepository.updateMany(
                { commentProductId: productId, commentLeft: { $gt: rightValue } },
                { $inc: { commentLeft: 2 } }
            );
        } else {
            const maxRightValue = await CommentRepository.findMaxRightValue(productId);

            if (maxRightValue) {
                rightValue = maxRightValue.commentRight + 1;
            } else {
                rightValue = 1;
            }
        }

        comment.commentLeft = rightValue;
        comment.commentRight = rightValue + 1;

        await CommentRepository.saveComment(comment);

        return comment;
    }

    static async getCommentByParentId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0,
    }) {
        const query = { commentProductId: productId };

        if (parentCommentId) {
            const parent = await CommentRepository.findById(parentCommentId);
            if (!parent) throw new NotFound('Not found comment for product');

            query.commentLeft = { $gt: parent.commentLeft };
            query.commentRight = { $lte: parent.commentRight };
        } else {
            query.commentParentId = parentCommentId;
        }

        return CommentRepository.findComments(query, offset, limit);
    }

    static async deleteComment({ commentId, productId }) {
        const foundProduct = await getProductById(productId)

        if (!foundProduct) {
            throw new NotFound('Product not found');
        }

        const comment = await CommentRepository.findById(commentId);

        if (!comment) {
            throw new NotFound('Comment not found');
        }

        const leftValue = comment.commentLeft
        const rightValue = comment.commentRight

        const width = rightValue - leftValue + 1

        await CommentRepository.deleteMany({
            commentProductId: productId,
            commentLeft: { $gte: leftValue, $lte: rightValue }
        })

        await CommentRepository.updateMany({
            commentProductId: productId,
            commentRight: { $gt: rightValue }
        }, {
            $inc: { commentRight: -width }
        })

        await CommentRepository.updateMany({
            commentProductId: productId,
            commentLeft: { $gt: rightValue }
        }, {
            $inc: { commentLeft: -width }
        })

        return true
    }
}

module.exports = CommentService;
