"use strict"

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Role";
const COLLECTION_NAME = "Roles";

// const grantList = [
//     { role: 'admin', resource: 'profile', action: 'read:own', attributes: '*' }
// ]

const roleSchema = new Schema(
    {
        roleName: { type: String, default: 'user', enum: ['user', 'shop', 'admin'] },
        roleSlug: { type: String, required: true },
        roleStatus: { type: String, default: 'active', enum: ['active', 'inactive', 'pending'] },
        roleDescription: { type: String, default: '' },
        roleGrants: [
            {
                resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
                actions: [{ type: String, required: true }],
                attributes: { type: String, default: '*' }
            }
        ]
    }, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

module.exports = model(DOCUMENT_NAME, roleSchema);

