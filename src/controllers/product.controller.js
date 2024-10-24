"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.v2");

class ProductController {
  // async createProduct(req, res, next) {
  //   // console.log(req);
  //   new CREATED({
  //     message: "Create new product success!",
  //     metadata: await ProductService.createProduct(req.body.productType, {
  //       ...req.body,
  //       productShop: req.user.userId,
  //     }),
  //   }).send(res);
  // }

  async createProduct(req, res, next) {
    // console.log(req);
    new CREATED({
      message: "Create new product success!",
      metadata: await ProductServiceV2.createProduct(req.body.productType, {
        ...req.body,
        productShop: req.user.userId,
      }),
    }).send(res);
  }

  async updateProduct(req, res, next) {
    new SuccessResponse({
      message: "Update product success",
      metadata: await ProductServiceV2.updateProduct(
        req.params.productId,
        {
          ...req.body,
          productShop: req.user.userId,
        }
      ),
    }).send(res);
  }

  async publishProductByShop(req, res, next) {
    new SuccessResponse({
      message: "Published product success",
      metadata: await ProductServiceV2.toggleProductPublishStatus({
        productId: req.params.id,
        productShop: req.user.userId,
        isPublished: true,
      }),
    }).send(res);
  }

  async unPublishProductByShop(req, res, next) {
    new SuccessResponse({
      message: "Unpublished product success",
      metadata: await ProductServiceV2.toggleProductPublishStatus({
        productId: req.params.id,
        productShop: req.user.userId,
        isPublished: false,
      }),
    }).send(res);
  }

  //Query
  /**
   *
   * @desc Get all drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  async getAllDraftsForShop(req, res, next) {
    new SuccessResponse({
      message: "Get all drafts success",
      metadata: await ProductServiceV2.findAllDraftsForShop({
        productShop: req.user.userId,
      }),
    }).send(res);
  }

  async getAllPublishedForShop(req, res, next) {
    new SuccessResponse({
      message: "Get all published success",
      metadata: await ProductServiceV2.findAllPublishedForShop({
        productShop: req.user.userId,
      }),
    }).send(res);
  }

  async getListSearchProduct(req, res, next) {
    new SuccessResponse({
      message: "Get all search results success",
      metadata: await ProductServiceV2.getListSearchProducts(req.params),
    }).send(res);
  }

  async getAllProducts(req, res, next) {
    new SuccessResponse({
      message: "Get all products success",
      metadata: await ProductServiceV2.findAllProducts(req.query),
    }).send(res);
  }

  async getProduct(req, res, next) {
    new SuccessResponse({
      message: "Get all product success",
      metadata: await ProductServiceV2.findProduct({
        productId: req.params.productId,
      }),
    }).send(res);
  }
}

module.exports = new ProductController();
