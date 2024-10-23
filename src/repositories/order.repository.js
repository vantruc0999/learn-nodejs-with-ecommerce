"use strict"

const order = require("../models/order.model")

const create = async ({ userId, checkout_order, user_address, user_payment, shop_order_ids_new }) => {
    return await order.create({
        order_user_id: userId,
        order_checkout: checkout_order,
        user_shipping: user_address,
        order_products: shop_order_ids_new,
        order_payment: user_payment
    })
}

module.exports = {
    create
}