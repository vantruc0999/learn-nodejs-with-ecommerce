"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const inventorySchema = new Schema(
  {
    invent_product_id: { type: Schema.Types.ObjectId, ref: "Product" },
    invent_location: { type: String, default: "unknown" },
    invent_stock: { type: Number, required: true },
    invent_shop_id: { type: Schema.Types.ObjectId, ref: "Shop" },
    invent_reservations: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, inventorySchema);
