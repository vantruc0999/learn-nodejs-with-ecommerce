"use strict"

const shopModel = require("../models/shop.model")

const findByEmail = async (email) => {
    return await shopModel.findOne({ email }).lean()
}

const create = async ({ name, email, password, roles }) => {
    return await shopModel.create({
        name,
        email,
        password,
        roles
    })
}

module.exports = {
    findByEmail,
    create
}