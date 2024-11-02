"use strict";

const { SuccessResponse } = require("../core/success.response");
const { listNotiByUser } = require("../services/notification.service");

class NotificationController {
     listNotiByUser = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get list notification successfully',
            metadata: await listNotiByUser(req.query)
        }).send(res)
     }
}

module.exports = new NotificationController();