"use strict";

const { NotFound, BadRequestError } = require("../core/error.response");
const { findCartById } = require("../repositories/cart.repository");
const { create } = require("../repositories/order.repository");
const { checkProductByServer } = require("../repositories/product.repository");
const { deleteCartItems } = require("./cart.service");
const DiscountService = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

/*
    Payload:
    {
    "cartId": "",
    "userId": "",
    "shopOrderIds": [
        {
            "shopId": "",
            "shop_discount": [
                {
                    "shopId": "",
                    "quantity": "",
                    "productId": ""
                }
            ],
            "itemProducts": [
                {
                    "price": "",
                    "quantity": "",
                    "productId": ""
                }
            ]
        },
        {
            "shopId": "",
            "shop_discount": [
                {
                    "shopId": "",
                    "quantity": "",
                    "productId": ""
                }
            ],
            "itemProducts": [
                {
                    "price": "",
                    "quantity": "",
                    "productId": ""
                }
            ]
        }
    ]
}
*/

class CheckoutService {
  static async checkoutReview({ cartId, userId, shopOrderIds }) {
    const foundCart = await findCartById(cartId);

    if (!foundCart) throw new NotFound("Cart does not exists");

    const checkoutOrder = {
      totalPrice: 0,
      freeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    },
      newShopOrderIds = [];

    for (let i = 0; i < shopOrderIds.length; i++) {
      const {
        shopId,
        shopDiscounts = [],
        itemProducts = [],
      } = shopOrderIds[i];

      const checkProductServer = await checkProductByServer(itemProducts);

      const foundProductInCart = foundCart.cartProducts.find(product => product.productId === checkProductServer[0].productId);

      if (foundProductInCart.quantity !== checkProductServer[0].quantity)
        throw new BadRequestError("Order wrong")

      if (!checkProductServer[0]) throw new BadRequestError("Order wrong")
      console.log("checkProductServer::", checkProductServer);

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      checkoutOrder.totalPrice += checkoutPrice;

      const itemCheckOut = {
        shopId,
        shopDiscounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        itemProducts: checkProductServer,
      };

      if (shopDiscounts.length > 0) {
        //assume there's one discount
        const { totalPrice = 0, discount = 0 } =
          await DiscountService.getDiscountAmount({
            code: shopDiscounts[0].codeId,
            shopId: shopId,
            userId: userId,
            products: checkProductServer,
          });

        checkoutOrder.totalDiscount += discount;

        if (discount > 0) {
          itemCheckOut.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      checkoutOrder.totalCheckout += itemCheckOut.priceApplyDiscount;
      newShopOrderIds.push(itemCheckOut);
    }

    return {
      shopOrderIds,
      newShopOrderIds,
      checkoutOrder,
    };
  }

  //payload:
  /* 
  {
    "cartId": "671b719e700adbc27a32b4b5",
    "userId": 1001,
    "shopOrderIds": [
        {
            "shopId": "671a24286fd773843662bd3f",
            "shopDiscounts": [
                {
                    "discountId": "671b02b1fdefb063efb76a17",
                    "codeId": "SHOP-113"
                }
            ],
            "itemProducts": [
                {
                    "quantity": 5,
                    "productId": "671b00734d15bc6c43487f16"
                }
            ]
        },
        {
            "shopId": "671a24286fd773843662bd3f",
            "shopDiscounts": [],
            "itemProducts": [
                {
                    "quantity": 5,
                    "productId": "671b00614d15bc6c43487f0e"
                }
            ]
        }
    ],
    "userAddress": {
        "phoneNumber": "123456789",
        "address": "80 Le Loi, Hai Chau, Da Nang"
    },
    "userPayment": {
        "method": "paypal"
    }
}
  */
  static async orderByUser({
    shopOrderIds,
    cartId,
    userId,
    userAddress = {},
    userPayment = {}
  }) {
    const { newShopOrderIds, checkoutOrder } = await this.checkoutReview({
      cartId,
      userId,
      shopOrderIds
    })

    const products = newShopOrderIds.flatMap(order => order.itemProducts)
    console.log(`[1]:`, products)
    const acquireProduct = []

    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId)

      acquireProduct.push(keyLock ? true : false)

      if (keyLock) {
        await releaseLock(keyLock)
      }
    }

    if (acquireProduct.includes(false)) {
      throw new BadRequestError('Some products have been updated, please return cart...')
    }

    const newOrder = create({ userId, checkoutOrder, userAddress, userPayment, newShopOrderIds })

    const productIds = products.map(product => product.productId);

    if (newOrder) {
      await deleteCartItems({ userId, productIds });
    }

    return newOrder
  }

  static async getOrdersByUser() {

  }

  static async getDetailOrderByUser() {

  }

  static async cancelOrderByUser() {

  }

  static async updateOrderStatusByShop() {

  }
}

module.exports = CheckoutService;
