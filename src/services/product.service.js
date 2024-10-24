"use strict";

const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronic } = require("../models/product.model");

class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "Electronic":
        return new Electronic(payload).createProduct();
      case "Clothing":
        return new Clothing(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid product types ${type}`);
    }
  }
}

/**
 * productName: { type: String, required: true },
    productThumb: { type: String, required: true },
    productDescription: { type: String },
    productPrice: { type: Number, required: true },
    productQuantity: { type: Number, required: true },
    productType: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    productShop: { type: Schema.Types.ObjectId, ref: "Shop" },
    productAttributes: { type: Schema.Types.Mixed },
    required: true,
 */

class Product {
  constructor({
    productName,
    productThumb,
    productDescription,
    productPrice,
    productQuantity,
    productType,
    productShop,
    productAttributes,
  }) {
    this.productName = productName;
    this.productThumb = productThumb;
    this.productDescription = productDescription;
    this.productPrice = productPrice;
    this.productQuantity = productQuantity;
    this.productType = productType;
    this.productShop = productShop;
    this.productAttributes = productAttributes;
  }

  async createProduct(productId) {
    return await product.create({ ...this, _id: productId });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.productAttributes);
    if (!newClothing) throw new BadRequestError("Create new clothing error");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("create new product error");

    return newProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.productAttributes,
      productShop: this.productShop,
    });
    if (!newElectronic)
      throw new BadRequestError("Create new Electronic error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("create new product error");
    return newProduct;
  }
}

module.exports = ProductFactory;
