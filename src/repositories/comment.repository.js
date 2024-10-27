"use strict";

const commentModel = require("../models/comment.model");

class CommentRepository {
    static async findMaxRightValue(productId) {
        return commentModel.findOne(
            { commentProductId: productId },
            'commentRight',
            { sort: { commentRight: -1 } }
        );
    }

    static async findById(commentId) {
        return commentModel.findById(commentId);
    }

    static async findComments(query, offset, limit) {
        return commentModel.find(query)
            .select({
                commentLeft: 1,
                commentRight: 1,
                commentContent: 1,
                commentParentId: 1
            })
            .sort({ commentLeft: 1 })
            .skip(offset)
            .limit(limit);
    }

    static async updateMany(query, updateData) {
        return commentModel.updateMany(query, updateData);
    }

    static async deleteMany(query) {
        return commentModel.deleteMany(query);
    }

    static async saveComment(comment) {
        return comment.save();
    }
}

module.exports = CommentRepository;
