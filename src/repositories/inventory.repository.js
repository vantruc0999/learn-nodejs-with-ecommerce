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

module.exports = {
  insertInventory,
};
