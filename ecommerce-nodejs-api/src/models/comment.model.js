"use strict"

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Comments";

const commentSchema = new Schema({
    commentProductId: { type: Schema.Types.ObjectId, ref: 'Product' },
    commentUserId: { type: Number, default: 1 },
    commentContent: { type: String, default: "text" },
    commentLeft: { type: Number, default: 0 },
    commentRight: { type: Number, default: 0 },
    commentParentId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

module.exports = model(DOCUMENT_NAME, commentSchema);