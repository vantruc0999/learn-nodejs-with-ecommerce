"use strict";

const { NotFound } = require("../core/error.response");
const cartRepository = require("../repositories/cart.repository");
const { getProductById } = require("../repositories/product.repository");

class CartService {
  static async createUserCart({ userId, product }) {
    const query = { cartUserId: userId, cartState: "active" },
      updateOrInsert = {
        $addToSet: {
          cartProducts: product,
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
      cartUserId: userId,
      "cartProducts.productId": productId,
      cartState: "active",
    },
      updateSet = {
        $inc: {
          "cartProducts.$.quantity": quantity,
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

    if (!userCart || userCart.cartProducts.length === 0) {
      // Nếu giỏ hàng chưa tồn tại hoặc rỗng, tạo mới giỏ hàng và thêm sản phẩm
      return await this.createUserCart({ userId, product });
    }

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingProduct = userCart.cartProducts.find(
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

  static async addToCartV2({ userId, shopOrderIds = [] }) {
    const { productId, quantity, oldQuantity } =
      shopOrderIds[0]?.itemProducts[0];

    const foundProduct = await getProductById(productId);

    if (!foundProduct) throw new NotFound("Product not found");

    if (foundProduct.productShop.toString() !== shopOrderIds[0]?.shopId)
      throw new NotFound("Product does not belong to the shop");

    return await this.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - oldQuantity,
      },
    });
  }

  static async deleteCartItem({ userId, productId }) {
    const query = { cartUserId: userId, cartState: "active" },
      updateSet = {
        $pull: {
          cartProducts: {
            productId,
          },
        },
      };

    const deleteCart = await cartRepository.updateCart({ query, updateSet });

    return deleteCart;
  }

  static async deleteAllCartItems({ userId, productIds }) {
    const query = { cartUserId: userId, cartState: "active" };
    const updateSet = {
      $pull: {
        cartProducts: {
          productId: { $in: productIds },
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
