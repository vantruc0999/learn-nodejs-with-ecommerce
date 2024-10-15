"use strict";

const { BadRequestError, NotFound } = require("../core/error.response");
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const {
  findAllDraftsForShop,
  findAllPublishedForShop,
  getProductByIdAndShop,
  updateProductPublishStatus,
  searchProductByUser,
  findAllProducts,
  findProductWithUnSelectedFields,
  updateProductById,
  findProductWithSelectedFields,
} = require("../repositories/product.repository");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");

class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, classRef) {
    this.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = this.productRegistry[type];

    if (!productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).createProduct();
  }

  static async updateProduct(productId, payload) {
    const productType = await findProductWithSelectedFields({
      productId,
      select: ["product_type"],
    });

    const productClass = this.productRegistry[productType.product_type];

    if (!productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).updateProduct(productId);
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: false };
    return await findAllPublishedForShop({ query, limit, skip });
  }

  static async toggleProductPublishStatus({
    product_shop,
    product_id,
    isPublish,
  }) {
    const foundShop = await getProductByIdAndShop({ product_shop, product_id });

    if (!foundShop) {
      throw new NotFound("Shop not found !!!");
    }

    return await updateProductPublishStatus(foundShop, isPublish);
  }

  static async getListSearchProducts({ keySearch }) {
    return await searchProductByUser(keySearch);
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static async findProduct({ product_id }) {
    const foundProduct = await findProductWithUnSelectedFields({
      product_id,
      unSelect: ["createdAt", "updatedAt", "__v"],
    });

    if (!foundProduct) throw new NotFound("Product not found");

    return foundProduct;
  }
}

/**
 * product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: { type: Schema.Types.Mixed },
    required: true,
 */

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }

  async updateProduct(productId, payload) {
    return await updateProductById({ productId, payload, model: product });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Create new clothing error");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("create new product error");

    return newProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Create new Electronic error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Create new product error");
    return newProduct;
  }

  async updateProduct(productId) {
    const currentProduct = await product.findById(productId);
    if (!currentProduct) throw new NotFound("Product not found");
    // Merge current product attributes with new attributes from the payload
    const updatedAttributes = {
      ...currentProduct.product_attributes, // Existing attributes
      ...this.product_attributes, // New attributes (overwriting existing ones)
    };
    console.log("updatedAttributes", updatedAttributes);

    this.product_attributes = updatedAttributes;

    // Remove undefined fields
    const objectParams = removeUndefinedObject(this);

    // If there are product attributes to update, do so in the related model
    if (objectParams.product_attributes) {
      await updateProductById({
        productId,
        payload: objectParams.product_attributes,
        model: electronic,
      });
    }

    const updateProduct = await super.updateProduct(productId, objectParams);
    return updateProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("Create new Furniture error");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("create new furniture error");
    return newProduct;
  }
}

//register product types
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);
//add more product type here
module.exports = ProductFactory;
