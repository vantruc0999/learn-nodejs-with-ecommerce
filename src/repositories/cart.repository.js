"use strict";

const cart = require("../models/cart.model");

// Tìm giỏ hàng của người dùng theo userId và trạng thái
async function findUserCart({ userId, state = "active" }) {
  return await cart.findOne({ cart_user_id: userId, cart_state: state });
}

// Tạo hoặc cập nhật giỏ hàng của người dùng
async function createOrUpdateUserCart(query, update, options) {
  return await cart.findOneAndUpdate(query, update, options);
}

// Lưu lại giỏ hàng sau khi thay đổi
async function saveCart(userCart) {
  return await userCart.save();
}

async function updateCart({ query, updateSet }) {
  return await cart.updateOne(query, updateSet);
}

module.exports = {
  findUserCart,
  createOrUpdateUserCart,
  saveCart,
  updateCart
};
