"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new CREATED({
      message: "Code generated successfully",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shop_id: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodes = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all discount codes successfully",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shop_id: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all discount codes successfully",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };

  getAllDiscountCodesWithProducts = async (req, res, next) => {
    console.log(req.query);
    new SuccessResponse({
      message: "Get all discount codes successfully",
      metadata: await DiscountService.getAllDiscountCodesWithProducts({
        ...req.query,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
