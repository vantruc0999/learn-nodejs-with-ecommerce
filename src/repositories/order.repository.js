"use strict"

const order = require("../models/order.model")

const create = async ({ userId, checkoutOrder, userAddress, userPayment, shopOrderIdsNew }) => {
    return await order.create({
        orderUserId: userId,
        orderCheckout: checkoutOrder,
        userShipping: userAddress,
        orderProducts: shopOrderIdsNew,
        orderPayment: userPayment
    })
}

module.exports = {
    create
}