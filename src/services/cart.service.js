"use strict";

const { NotFound } = require("../core/error.response");
const cart = require("../models/cart.model");
const cartRepository = require("../repositories/cart.repository");
const { getProductById } = require("../repositories/product.repository");

class CartService {
  static async createUserCart({ userId, product }) {
    const query = { cart_user_id: userId, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { upsert: true, new: true };

    return await cartRepository.createOrUpdateUserCart(
      query,
      updateOrInsert,
      options
    );
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;

    const query = {
      cart_user_id: userId,
      "cart_products.productId": productId,
      cart_state: "active",
    },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = { upsert: true, new: true };
    // Gọi hàm từ cartRepository để cập nhật giỏ hàng
    return await cartRepository.createOrUpdateUserCart(
      query,
      updateSet,
      options
    );
  }

  static async addToCart({ userId, product = {} }) {
    const userCart = await cartRepository.findUserCart({ userId });

    if (!userCart || userCart.cart_products.length === 0) {
      // Nếu giỏ hàng chưa tồn tại hoặc rỗng, tạo mới giỏ hàng và thêm sản phẩm
      return await this.createUserCart({ userId, product });
    }

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingProduct = userCart.cart_products.find(
      (p) => p.productId.toString() === product.productId.toString()
    );

    if (existingProduct) {
      // Nếu sản phẩm đã tồn tại, cập nhật số lượng
      return await this.updateUserCartQuantity({ userId, product });
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào giỏ hàng
      return await this.createUserCart({ userId, product });
    }
  }

  static async addToCartV2({ userId, shop_order_ids = [] }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    const foundProduct = await getProductById(productId);

    if (!foundProduct) throw new NotFound("Product not found");

    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
      throw new NotFound("Product does not belong to the shop");

    return await this.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_user_id: userId, cart_state: "active" },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };

    const deleteCart = await cartRepository.updateCart({ query, updateSet });

    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await cartRepository.findUserCart({ userId });
  }
}

module.exports = CartService;
