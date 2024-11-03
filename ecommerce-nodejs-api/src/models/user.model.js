"use strict"

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const userSchema = new Schema(
    {
        userId: { type: Number, required: true },
        userSlug: { type: String, required: true },
        userName: { type: String, default: '' },
        userPassword: { type: String, default: '' },
        userSalt: { type: String, default: '' },
        userEmail: { type: String, required: true },
        userPhone: { type: String, default: '' },
        userGender: { type: String, default: '' },
        userAvatar: { type: String, default: '' },
        userDateOfBirth: { type: Date, default: null },
        userRole: { type: Schema.Types.ObjectId, ref: 'Role' },
        userStatus: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] },
    }, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

module.exports = model(DOCUMENT_NAME, userSchema);

