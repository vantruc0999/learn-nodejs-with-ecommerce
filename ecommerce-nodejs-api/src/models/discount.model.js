"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const discountSchema = new Schema(
  {
    discountName: { type: String, required: true },
    discountDescription: { type: String, required: true },
    discountType: { type: String, default: "fixedAmount" }, // or percentage
    discountValue: { type: Number, required: true },
    discountCode: { type: String, required: true },
    discountStartDate: { type: Date, required: true },
    discountEndDate: { type: Date, required: true },
    discountMaxUses: { type: Number, required: true }, // number of discount apply
    discountUsesCount: { type: Number, required: true }, // number of discount used
    discountUsersUsed: { type: Array, default: [] }, //people who used discount
    discountMaxUsesPerUser: { type: Number, required: true },
    discountMinOrderValue: { type: Number, required: true },
    discountShopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    discountIsActive: { type: Boolean, required: true },
    discountAppliesTo: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discountProductIds: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, discountSchema);
