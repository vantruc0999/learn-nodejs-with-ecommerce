"use strict";

const cartRepository = require("../repositories/cart.repository");

class CartService {
  static async createUserCart({ userId, product }) {
    const query = { cart_user_id: userId, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { upsert: true, new: true };

    return await cartRepository.createOrUpdateUserCart(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cart_user_id: userId,
        "cart_products.product.productId": productId,
        cart_state: "active",
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = { upsert: true, new: true };

    // Gọi hàm từ cartRepository để cập nhật giỏ hàng
    return await cartRepository.createOrUpdateUserCart(query, updateSet, options);
  }

  static async addToCart({ userId, product = {} }) {
    const userCart = await cartRepository.findUserCart({ userId });

    if (!userCart) {
      return await this.createUserCart({ userId, product });
    }

    if (userCart.cart_products.length === 0) {
      userCart.cart_products = [product]; // Sửa lỗi từ 'products' thành 'product'
      return await cartRepository.saveCart(userCart);
    }

    return await this.updateUserCartQuantity({ userId, product });
  }
}

module.exports = CartService;
