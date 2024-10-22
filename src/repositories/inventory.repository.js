"use strict";

const inventory = require("../models/inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}) => {
  return await inventory.create({
    invent_product_id: productId,
    invent_location: location,
    invent_stock: stock,
    invent_shop_id: shopId,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    invent_product_id: productId, invent_stock: { $gte: quantity },
  }, updateSet = {
    $inc: { invent_stock: -quantity },
    $push: {
      invent_reservation:
        { quantity, cartId, createdOn: new Date() }
    },
  }, options = { upsert: true, new: true }

  return await inventory.updateOne(query, updateSet, options)
}

const findOneAndUpdate = async (query, updateSet, options) => {
  return await inventory.findOneAndUpdate(query, updateSet, options)
}

module.exports = {
  insertInventory,
  reservationInventory,
  findOneAndUpdate
};
