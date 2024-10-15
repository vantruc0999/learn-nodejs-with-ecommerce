"use strict";

const {
  product,
  electronic,
  clothes,
  furniture,
} = require("../models/product.model");
const { getSelectData, omitData } = require("../utils");

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
        isPublished: true,
        $text: { $search: keySearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return results;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return products;
};

const findProductWithUnSelectedFields = async ({ product_id, unSelect }) => {
  return await product.findById(product_id).select(omitData(unSelect));
};

const findProductWithSelectedFields = async ({ productId, select }) => {
  return await product.findById(productId).select(getSelectData(select));
};

const updateProductById = async ({
  productId,
  payload,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, payload, {
    new: isNew,
  });
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
  updateProductById,
  searchProductByUser,
  findAllProducts,
  findProductWithUnSelectedFields,
  findProductWithSelectedFields,
};
