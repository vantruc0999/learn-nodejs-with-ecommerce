"use strict";

const inventoryModel = require("../models/inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}) => {
  return await inventoryModel.create({
    inventProductId: productId,
    inventLocation: location,
    inventStock: stock,
    inventShopId: shopId,
  });
};

const findInventoryByProduct = async (productId) => {
  return await inventoryModel.findOne({
    inventProductId: productId
  });
};


const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    inventProductId: productId, inventStock: { $gte: quantity },
  }, updateSet = {
    $inc: { inventStock: -quantity },
    $push: {
      inventReservation:
        { quantity, cartId, createdOn: new Date() }
    },
  }, options = { upsert: true, new: true }

  return await inventoryModel.updateOne(query, updateSet, options)
}

const findOneAndUpdate = async (query, updateSet, options) => {
  return await inventoryModel.findOneAndUpdate(query, updateSet, options)
}

module.exports = {
  insertInventory,
  reservationInventory,
  findInventoryByProduct,
  findOneAndUpdate
};
