"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderSchema = new Schema(
    {
        orderUserId: { type: Number, required: true },
        orderCheckout: { type: Object, default: {} },
        /*
            order_checkout = {
                totalPrice,
                totalApplyDiscount,
                freeShip
            }
        */
        orderShipping: {
            type: Object, default: {},
            /*
                street,
                city,
                state,
                country
            */
        },
        orderPayment: { type: Object, default: {} },
        orderProducts: { type: Array, required: true },
        orderTrackingNumber: {
            type: String, default: '#000022102024'
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
