"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const inventorySchema = new Schema(
  {
    inventProductId: { type: Schema.Types.ObjectId, ref: "Product" },
    inventLocation: { type: String, default: "unknown" },
    inventStock: { type: Number, required: true },
    inventShopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    inventReservations: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, inventorySchema);
