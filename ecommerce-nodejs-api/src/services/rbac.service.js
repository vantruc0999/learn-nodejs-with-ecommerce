"use strict"

const RbacRepository = require("../repositories/rbac.repository")

const createResource = async ({
    name,
    slug,
    description
}) => {
    try {
        const resource = await RbacRepository.createResource({ name, slug, description })
        return resource
    } catch (error) {
        return error
    }
}

const resourceList = async ({
    userId = 0,
    limit = 30,
    offset = 0,
    search = ''
}) => {
    try {
        const resources = await RbacRepository.getListResource();
        return resources
    } catch (error) {
        return []
    }
}

const createRole = async ({
    name = 'shop',
    slug = 's00001',
    description = 'extend from shop or user',
    grants = []
}) => {
    try {
        const role = await RbacRepository.createRole({ name, slug, description, grants })
        return role
    } catch (error) {
        return error
    }
}

const roleList = async () => {
    try {
        return await RbacRepository.getListRoles()
    } catch (error) {
        return error
    }
}

module.exports = {
    createResource,
    resourceList,
    createRole,
    roleList
}

