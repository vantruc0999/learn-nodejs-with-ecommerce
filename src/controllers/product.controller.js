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
}

module.exports = new ProductController();
