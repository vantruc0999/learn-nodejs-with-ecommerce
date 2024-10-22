"use strict"

const { BadRequestError } = require("../core/error.response")
const { findOneAndUpdate } = require("../repositories/inventory.repository")
const { getProductById } = require("../repositories/product.repository")

class InventoryService {
    static async addStockToInventory({ stock, productId, shopId, location = '80 Le Loi, Hai Chau, Da Nang' }) {
        const product = await getProductById(productId)

        if (!product) throw new BadRequestError('Product not exists')

        const query = { invent_shop_id: shopId, invent_product_id: productId },
            updateSet = {
                $inc: {
                    invent_stock: stock
                },
                $set: {
                    invent_location: location
                }
            },
            options = {
                upsert: true, new: true
            }

        return await findOneAndUpdate(query, updateSet, options)
    }
}

module.exports = InventoryService