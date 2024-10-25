"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new Schema(
  {
    cartState: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"],
      default: "active",
    },
    cartProducts: [
      {
        productId: { type: String, required: true },
        shopId: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    cartCountProduct: { type: Number, required: true },
    cartUserId: { type: Number },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, cartSchema);
