"use strict";

const {
  product,
  electronic,
  clothes,
  furniture,
} = require("../models/product.model");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishedForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const searchProductByUser = async (keySearch) => {
  const results = await product
    .find(
      {
        $text: { $search: keySearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return results;
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const getProductByIdAndShop = async ({ product_shop, product_id }) => {
  return await product.findOne({
    product_shop,
    _id: product_id,
  });
};

const updateProductPublishStatus = async (foundShop, isPublish) => {
  foundShop.isDraft = !isPublish;
  foundShop.isPublished = isPublish;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

module.exports = {
  findAllDraftsForShop,
  getProductByIdAndShop,
  findAllPublishedForShop,
  updateProductPublishStatus,
  searchProductByUser,
};
