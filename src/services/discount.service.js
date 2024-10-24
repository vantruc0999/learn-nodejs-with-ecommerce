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
      startDate,
      endDate,
      isActive,
      shopId,
      minOrderValue,
      productIds,
      appliesTo,
      name,
      description,
      type,
      value,
      usersUsed,
      maxUses,
      usesCount,
      maxUsesPerUser,
    } = payload;

    if (new Date() < new Date(startDate) && new Date() > new Date(endDate)) {
      throw new BadRequestError("Discount code has expired");
    }

    if (new Date(startDate) >= new Date(endDate)) {
      throw new BadRequestError("Start date must before end date");
    }

    const foundDiscount = await findDiscount({ code, shopId });

    if (foundDiscount) {
      throw new ConflictRequestError("Discount already exists");
    }

    const newDiscount = await discount.create({
      discountName: name,
      discountDescription: description,
      discountType: type,
      discountValue: value,
      discountCode: code,
      discountStartDate: new Date(startDate),
      discountEndDate: new Date(endDate),
      discountMaxUses: maxUses,
      discountUsesCount: usesCount,
      discountUsersUsed: usersUsed,
      discountMaxUsesPerUser: maxUsesPerUser,
      discountMinOrderValue: minOrderValue || 0,
      discountShopId: shopId,
      discountIsActive: isActive,
      discountAppliesTo: appliesTo, // Keep as "specific" or "all"
      discountProductIds: appliesTo === "specific" ? productIds : [],
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

    if (!foundDiscount || !foundDiscount.discountIsActive) {
      throw new NotFound("discount not exists");
    }

    const { discountAppliesTo, discountProductIds } = foundDiscount;
    let products;
    if (discountAppliesTo === "all") {
      products = findAllProducts({
        filter: {
          productShop: shopId,
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["productName"],
      });
    }

    if (discountAppliesTo === "specific") {
      console.log('discountProductIds', discountProductIds);
      products = await findAllProducts({
        filter: {
          _id: { $in: discountProductIds },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["productName"],
      });
    }

    return products;
  }

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnselect({
      limit: +limit,
      page: +page,
      filter: {
        discountShopId: shopId,
        discountIsActive: true,
      },
      unselect: ["__v", "discountShopId"],
    });

    return discounts;
  }

  static async getDiscountAmount({ code, userId, shopId, products }) {
    const foundDiscount = await findDiscount({ codeId: code, shopId: shopId });

    if (!foundDiscount) throw new NotFound("discount not exists");
    const {
      discountIsActive,
      discountMaxUses,
      discountMinOrderValue,
      discountUsersUsed,
      discountStartDate,
      discountEndDate,
      discountMaxUsesPerUser,
      discountType,
      discountValue,
    } = foundDiscount;

    if (!discountIsActive) throw new NotFound("discount expired");
    if (!discountMaxUses) throw new NotFound("discount are out");

    if (
      new Date() < new Date(discountStartDate) &&
      new Date() > new Date(discountEndDate)
    ) {
      throw new BadRequestError("Discount code has expired");
    }

    let totalOrder = 0;

    if (discountMinOrderValue > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
    }

    if (totalOrder < discountMinOrderValue) {
      throw new NotFound(
        `discount requires a min order value of ${discountMinOrderValue}`
      );
    }

    if (discountMaxUsesPerUser > 0) {
      const userDiscount = discountUsersUsed.find(
        (user) => user.userId == userId
      );
      if (userDiscount) {
      }
    }

    const amount =
      discountType === "fixedAmount"
        ? discountValue
        : totalOrder * (discountValue / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discount.findOneAndDelete({
      discountCode: codeId,
      discountShopId: shopId,
    });
    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = findDiscount({ codeId, shopId });

    if (!foundDiscount) throw new NotFound("discount not exists");

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discountUsersUsed: userId,
      },
      $inc: {
        discountMaxUses: 1,
        discountUsesCount: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
