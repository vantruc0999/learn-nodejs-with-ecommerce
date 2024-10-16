"use strict";

const {
  BadRequestError,
  ConflictRequestError,
  NotFound,
} = require("../core/error.response");
const {
  findDiscount,
  findAllDiscountCodesSelect,
  findAllDiscountCodesUnselect,
} = require("../repositories/discount.repository");
const { findAllProducts } = require("../repositories/product.repository");

/**
 * Discount Services
 * 1 - Generator discount code [Shop|Admin]
 * 2 - Get all discount amount [User]
 * 3 - Get all discount code [User]
 * 4 - Verify discount code [User]
 * 5 - Delete discount code [Shop|Admin]
 * 6 - Cancel discount code [User]
 */

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shop_id,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      use_count,
      max_uses_per_user,
    } = payload;

    if (new Date() < new Date(start_date) && new Date() > new Date(end_date)) {
      throw new BadRequestError("Discount code has expired");
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Start date must before end date");
    }

    const foundDiscount = await findDiscount({ code, shop_id });

    if (foundDiscount) {
      throw new ConflictRequestError("Discount already exists");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shop_id: shop_id,
      discount_is_active: is_active,
      discount_applies_to: applies_to === "all" ? [] : product_ids,
      discount_product_ids: product_ids,
    });

    return newDiscount;
  }

  static async getAllDiscountCodesWithProduct({
    code,
    shop_id,
    user_id,
    limit,
    page,
  }) {
    const foundDiscount = findDiscount(code, shop_id);

    if (!foundDiscount || !foundDiscount.is_active) {
      throw new NotFound("discount not exists");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      products = findAllProducts({
        filter: {
          product_shop: shop_id,
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      products = findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  static async getAllDiscountCodesByShop({ limit, page, shop_id }) {
    const discounts = await findAllDiscountCodesUnselect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shop_id: shop_id,
        discount_is_actie: true,
      },
      unselect: ["__v", "discount_shop_id"],
    });

    return discounts;
  }
}
