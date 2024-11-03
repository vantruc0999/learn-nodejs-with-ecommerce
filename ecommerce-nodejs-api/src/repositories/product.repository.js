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

const findProductWithUnSelectedFields = async ({ productId, unSelect }) => {
  return await product.findById(productId).select(omitData(unSelect));
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
    .populate("productShop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const getProductByIdAndShop = async ({ productShop, productId }) => {
  return await product.findOne({
    productShop,
    _id: productId,
  });
};

const getProductById = async (productId) => {
  return await product.findOne({ _id: productId }).lean();
};

const updateProductPublishStatus = async (foundShop, isPublish) => {
  foundShop.isDraft = !isPublish;
  foundShop.isPublished = isPublish;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product.productId);
      if (foundProduct) {
        return {
          price: foundProduct.productPrice,
          quantity: product.quantity,
          productId: product.productId,
        };
      }
    })
  );
};

module.exports = {
  findAllDraftsForShop,
  getProductByIdAndShop,
  getProductById,
  findAllPublishedForShop,
  updateProductPublishStatus,
  updateProductById,
  searchProductByUser,
  findAllProducts,
  findProductWithUnSelectedFields,
  findProductWithSelectedFields,
  checkProductByServer,
};
