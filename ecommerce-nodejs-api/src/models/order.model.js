"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";


const itemProductSchema = new Schema(
    {
        price: { type: Number },
        quantity: { type: Number },
        productId: { type: String },
    },
    { _id: false }
);


const orderProductSchema = new Schema(
    {
        shopId: { type: String },
        shopDiscounts: [
            {
                discountId: { type: String },
                codeId: { type: String },
            },
        ],
        priceRaw: { type: Number },
        priceApplyDiscount: { type: Number },
        itemProducts: [itemProductSchema],
    },
    { _id: false }
);

const orderSchema = new Schema(
    {
        orderUserId: { type: Number, required: true },
        orderCheckout: { type: Object, default: {} },
        orderShipping: { type: Object, default: {} },
        orderPayment: { type: Object, default: {} },
        orderProducts: { type: [orderProductSchema] },
        orderTrackingNumber: {
            type: String,
            default: '#000022102024'
        },
        orderStatus: {
            type: String,
            enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
            default: 'pending'
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, orderSchema);
