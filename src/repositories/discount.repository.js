"use strict";

const discount = require("../models/discount.model");
const { getSelectData, omitData } = require("../utils");

const findDiscount = async ({ code, shop_id }) => {
  return await discount
    .findOne({ discount_code: code, discount_shop_id: shop_id })
    .lean();
};

const findAllDiscountCodesUnselect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await discount
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(omitData(unSelect))
    .lean();
  return documents;
};

const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return documents;
};

module.exports = {
  findDiscount,
  findAllDiscountCodesUnselect,
  findAllDiscountCodesSelect,
};
