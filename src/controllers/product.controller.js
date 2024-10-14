"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.v2");

class ProductController {
  // async createProduct(req, res, next) {
  //   // console.log(req);
  //   new CREATED({
  //     message: "Create new product success!",
  //     metadata: await ProductService.createProduct(req.body.product_type, {
  //       ...req.body,
  //       product_shop: req.user.userId,
  //     }),
  //   }).send(res);
  // }

  async createProduct(req, res, next) {
    // console.log(req);
    new CREATED({
      message: "Create new product success!",
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  }

  async publishProductByShop(req, res, next) {
    new SuccessResponse({
      message: "Published product success",
      metadata: await ProductServiceV2.toggleProductPublishStatus({
        product_id: req.params.id,
        product_shop: req.user.userId,
        isPublish: true,
      }),
    }).send(res);
  }

  async unPublishProductByShop(req, res, next) {
    new SuccessResponse({
      message: "Un published product success",
      metadata: await ProductServiceV2.toggleProductPublishStatus({
        product_id: req.params.id,
        product_shop: req.user.userId,
        isPublish: false,
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
        product_shop: req.user.userId,
      }),
    }).send(res);
  }

  async getAllPublishedForShop(req, res, next) {
    new SuccessResponse({
      message: "Get all published success",
      metadata: await ProductServiceV2.findAllPublishedForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  }

  async getListSearchProduct(req, res, next) {
    new SuccessResponse({
      message: "Get all search results success",
      metadata: await ProductServiceV2.getListSearchProduct(req.params),
    }).send(res);
  }
}

module.exports = new ProductController();
