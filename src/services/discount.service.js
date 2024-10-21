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
const discount = require("../models/discount.model");
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
      users_used,
      max_uses,
      uses_count,
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
      discount_applies_to: applies_to, // Keep as "specific" or "all"
      discount_product_ids: applies_to === "specific" ? product_ids : [],
    });

    return newDiscount;
  }

  static async getAllDiscountCodesWithProducts({
    codeId,
    shopId,
    limit,
    page,
  }) {
    const foundDiscount = await findDiscount({ codeId, shopId });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFound("discount not exists");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      products = findAllProducts({
        filter: {
          product_shop: shopId,
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      console.log('discount_product_ids', discount_product_ids);
      products = await findAllProducts({
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
        discount_is_active: true,
      },
      unselect: ["__v", "discount_shop_id"],
    });

    return discounts;
  }

  static async getDiscountAmount({ code, user_id, shop_id, products }) {
    const foundDiscount = await findDiscount({ codeId: code, shopId: shop_id });

    if (!foundDiscount) throw new NotFound("discount not exists");
    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_users_used,
      discount_start_date,
      discount_end_date,
      discount_max_uses_per_user,
      discount_type,
      discount_value,
    } = foundDiscount;

    if (!discount_is_active) throw new NotFound("discount expired");
    if (!discount_max_uses) throw new NotFound("discount are out");

    if (
      new Date() < new Date(discount_start_date) &&
      new Date() > new Date(discount_end_date)
    ) {
      throw new BadRequestError("Discount code has expired");
    }

    let totalOrder = 0;

    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
    }

    if (totalOrder < discount_min_order_value) {
      throw new NotFound(
        `discount requires a min order value of ${discount_min_order_value}`
      );
    }

    if (discount_max_uses_per_user > 0) {
      const userDiscount = discount_users_used.find(
        (user) => user.userId == user_id
      );
      if (userDiscount) {
      }
    }

    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shop_id, code_id }) {
    const deleted = await discount.findOneAndDelete({
      discount_code: code_id,
      discount_shop_id: shop_id,
    });
    return deleted;
  }

  static async cancelDiscountCode({ code_id, shop_id, user_id }) {
    const foundDiscount = findDiscount({ code_id, shop_id });

    if (!foundDiscount) throw new NotFound("discount not exists");

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: user_id,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
