"use strict";

const { model, Schema } = require("mongoose");
const { default: slugify } = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    productName: { type: String, required: true },
    productThumb: { type: String, required: true },
    productDescription: { type: String },
    productSlug: { type: String },
    productPrice: { type: Number, required: true },
    productQuantity: { type: Number, required: true },
    productType: {
      type: String,
      required: true,
      enum: ["Electronic", "Clothing", "Furniture"],
    },
    productShop: { type: Schema.Types.ObjectId, ref: "Shop" },
    productAttributes: { type: Schema.Types.Mixed },
    productRatingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    productVariations: { type: Array, default: [] },
    isDraft: { type: Boolean, index: true, select: false, default: true },
    isPublished: { type: Boolean, index: true, select: false, default: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Create index for search
productSchema.index({ productName: "text", productDescription: "text" });

//Document middleware: run before .save() and .create()
productSchema.pre("save", function (next) {
  this.productSlug = slugify(this.productName, { lower: true });
  next();
});

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    productShop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    timestamps: true,
    collection: "clothes",
  }
);

const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    productShop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    timestamps: true,
    collection: "electronics",
  }
);

const furnitureSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    productShop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    timestamps: true,
    collection: "furnitures",
  }
);

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  electronic: model("Electronics", electronicSchema),
  clothing: model("Clothing", clothingSchema),
  furniture: model("Furniture", furnitureSchema),
};
