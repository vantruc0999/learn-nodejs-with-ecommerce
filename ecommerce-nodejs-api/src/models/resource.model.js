"use strict"

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Resource";
const COLLECTION_NAME = "Resources";

const resourceSchema = new Schema(
    {
        resourceName: { type: String, required: true },
        resourceSlug: { type: String, required: true },
        resourceDescription: { type: String, default: '' }
    }, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

module.exports = model(DOCUMENT_NAME, resourceSchema);

