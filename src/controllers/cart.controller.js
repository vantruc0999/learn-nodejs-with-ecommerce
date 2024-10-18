"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new cart successfully",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  updateCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Update cart successfully",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  deleteCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete cart successfully",
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };

  getCartList = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list cart successfully",
      metadata: await CartService.getListUserCart(req.body),
    }).send(res);
  };
}

module.exports = new CartController();
