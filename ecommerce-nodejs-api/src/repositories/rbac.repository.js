"use strict";

const resourceModel = require("../models/resource.model");
const roleModel = require("../models/role.model");

class RbacRepository {
    static async createResource({ name, slug, description }) {
        return await resourceModel.create({
            resourceName: name,
            resourceSlug: slug,
            resourceDescription: description
        });
    }

    static async createRole({ name, slug, description, grants }) {
        return await roleModel.create({
            roleName: name,
            roleSlug: slug,
            roleDescription: description,
            roleGrants: grants
        });
    }

    static async getListResource() {
        const resources = await resourceModel.aggregate([
            {
                $project: {
                    _id: 0,
                    name: '$resourceName',
                    slug: '$resourceSlug',
                    description: '$resourceDescription',
                    resourceId: '$_id',
                    createdAt: 1
                }
            }
        ])
        return resources
    }

    static async getListRoles() {
        const roles = await roleModel.aggregate([
            {
                $unwind: "$roleGrants"  // Tách từng phần tử roleGrants thành các tài liệu riêng
            },
            {
                $unwind: "$roleGrants.actions"  // Tách từng action trong roleGrants thành các tài liệu riêng
            },
            {
                $lookup: {
                    from: "Resources",  // Tên collection của tài liệu Resource
                    localField: "roleGrants.resource",
                    foreignField: "_id",
                    as: "resourceDetails"
                }
            },
            {
                $unwind: "$resourceDetails"  // Lấy thông tin tài liệu Resource từ lookup
            },
            {
                $project: {
                    _id: 0,
                    role: "$roleName",
                    resource: "$resourceDetails.resourceName",
                    action: "$roleGrants.actions",
                    attributes: "$roleGrants.attributes"
                }
            }
        ]);

        return roles;
    }

}

module.exports = RbacRepository;
