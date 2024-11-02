"use strict"

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

const notificationSchema = new Schema({
    notiType: { type: String, enum: ['ORDER-001', 'PROMOTION-001', 'SHOP-001'], required: true },
    notiSenderId: { type: Schema.Types.ObjectId, required: true, ref: 'Shop' },
    notiReceiverId: { type: Number, required: true },
    notiContent: { type: String, required: true },
    notiOptions: { type: Object, default: {} }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

module.exports = model(DOCUMENT_NAME, notificationSchema)

