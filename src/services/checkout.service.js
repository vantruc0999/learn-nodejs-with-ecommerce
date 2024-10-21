"use strict";

const { NotFound, BadRequestError } = require("../core/error.response");
const { findCartById } = require("../repositories/cart.repository");
const { checkProductByServer } = require("../repositories/product.repository");
const DiscountService = require("./discount.service");

/*
    Payload:
    {
    "cartId": "",
    "userId": "",
    "shop_order_ids": [
        {
            "shopId": "",
            "shop_discount": [
                {
                    "shopId": "",
                    "quantity": "",
                    "productId": ""
                }
            ],
            "item_products": [
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
            "item_products": [
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
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new NotFound("Cart does not exists");

    const checkout_order = {
      totalPrice: 0,
      freeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    },
      shop_order_ids_new = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];

      const checkProductServer = await checkProductByServer(item_products);

      if (!checkProductServer[0]) throw new BadRequestError("Order wrong");
      console.log("checkProductServer::", checkProductServer);

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      checkout_order.totalPrice += checkoutPrice;

      const itemCheckOut = {
        shopId,
        shop_discounts,
        price_raw: checkoutPrice,
        price_apply_discount: checkoutPrice,
        item_products: checkProductServer,
      };

      if (shop_discounts.length > 0) {
        //assume there's one discount
        const { totalPrice = 0, discount = 0 } =
          await DiscountService.getDiscountAmount({
            code: shop_discounts[0].codeId,
            shop_id: shopId,
            user_id: userId,
            products: checkProductServer,
          });

        checkout_order.totalDiscount += discount;

        if (discount > 0) {
          itemCheckOut.price_apply_discount = checkoutPrice - discount;
        }
      }

      checkout_order.totalCheckout += itemCheckOut.price_apply_discount;
      shop_order_ids_new.push(itemCheckOut);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }
}

module.exports = CheckoutService;
