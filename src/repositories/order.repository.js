"use strict"

const order = require("../models/order.model")

const create = async ({ userId, checkoutOrder, userAddress, userPayment, newShopOrderIds }) => {
    return await order.create({
        orderUserId: userId,
        orderCheckout: checkoutOrder,
        orderShipping: userAddress,
        orderProducts: newShopOrderIds,
        orderPayment: userPayment
    })
}

module.exports = {
    create
}