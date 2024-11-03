"use strict"

const { Unauthorized } = require("../core/error.response")
const { roleList } = require("../services/rbac.service")
const rbac = require('./role.middleware')
const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            rbac.setGrants(await roleList())

            const roleName = req.query.role
            const permission = rbac.can(roleName)[action](resource)

            if (!permission.granted) {
                throw new Unauthorized('You dont have permission to access this resource')
            }

            next()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    grantAccess
}