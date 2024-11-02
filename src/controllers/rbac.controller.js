"use strict"

const { SuccessResponse } = require("../core/success.response")
const { createResource, createRole, roleList, resourceList } = require("../services/rbac.service")

const newRole = async (req, res, next) => {
    new SuccessResponse({
        message: 'Create role successfully',
        metadata: await createRole(req.body)
    }).send(res)
}

const listRoles = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get all roles successfully',
        metadata: await roleList(req.query)
    }).send(res)
}

const newResource = async (req, res, next) => {
    new SuccessResponse({
        message: 'Create rescource successfully',
        metadata: await createResource(req.body)
    }).send(res)
}

const listResources = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get all resources successfully',
        metadata: await resourceList(req.query)
    }).send(res)
}

module.exports = {
    newRole,
    listRoles,
    newResource,
    listResources
}