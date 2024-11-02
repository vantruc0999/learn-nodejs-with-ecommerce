"use strict"

const AccessControl = require('accesscontrol')

// let grantList = [
//     { role: 'admin', resource: 'shop', action: 'create:any', attributes: '*, !views' },
//     { role: 'admin', resource: 'shop', action: 'read:any', attributes: '*' },
//     { role: 'admin', resource: 'shop', action: 'update:any', attributes: '*, !views' },
//     { role: 'admin', resource: 'shop', action: 'delete:any', attributes: '*' },

//     { role: 'shop', resource: 'shop', action: 'create:own', attributes: '*,  !views' },
//     { role: 'shop', resource: 'shop', action: 'read:any', attributes: '*' },
//     { role: 'shop', resource: 'shop', action: 'update:own', attributes: '*, !views' },
//     { role: 'shop', resource: 'shop', action: 'delete:own', attributes: '*' }
// ];

module.exports = new AccessControl()