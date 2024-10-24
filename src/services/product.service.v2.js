"use strict";

const { BadRequestError, NotFound } = require("../core/error.response");
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const { insertInventory } = require("../repositories/inventory.repository");
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
      select: ["productType"],
    });

    const productClass = this.productRegistry[productType.productType];

    if (!productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).updateProduct(productId);
  }

  static async findAllDraftsForShop({ productShop, limit = 50, skip = 0 }) {
    const query = { productShop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishedForShop({ productShop, limit = 50, skip = 0 }) {
    const query = { productShop, isDraft: false };
    return await findAllPublishedForShop({ query, limit, skip });
  }

  static async toggleProductPublishStatus({
    productShop,
    productId,
    isPublished,
  }) {
    const foundShop = await getProductByIdAndShop({ productShop, productId });

    if (!foundShop) {
      throw new NotFound("Shop not found !!!");
    }

    return await updateProductPublishStatus(foundShop, isPublished);
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
      select: ["productName", "productPrice", "productThumb", "productShop"],
    });
  }

  static async findProduct({ productId }) {
    const foundProduct = await findProductWithUnSelectedFields({
      productId,
      unSelect: ["createdAt", "updatedAt", "__v"],
    });

    if (!foundProduct) throw new NotFound("Product not found");

    return foundProduct;
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
    const newProduct = await product.create({ ...this, _id: productId });
    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: this.productShop,
        stock: this.productQuantity,
      });
    }
    return newProduct;
  }

  async updateProduct(productId, payload) {
    return await updateProductById({ productId, payload, model: product });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.productAttributes,
      productShop: this.productShop,
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
      ...this.productAttributes,
      productShop: this.productShop,
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
      ...currentProduct.productAttributes, // Existing attributes
      ...this.productAttributes, // New attributes (overwriting existing ones)
    };
    console.log("updatedAttributes", updatedAttributes);

    this.productAttributes = updatedAttributes;

    // Remove undefined fields
    const objectParams = removeUndefinedObject(this);

    // If there are product attributes to update, do so in the related model
    if (objectParams.productAttributes) {
      await updateProductById({
        productId,
        payload: objectParams.productAttributes,
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
      ...this.productAttributes,
      productShop: this.productShop,
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
