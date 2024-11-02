"use strict";

const notificationModel = require("../models/notification.model");

const insertNotification = async ({
    type,
    notiContent,
    senderId,
    receiverId,
    options
}) => {
    return await notificationModel.create({
        notiType: type,
        notiContent,
        notiSenderId: senderId,
        notiReceiverId: receiverId,
        notiOptions: options
    });
};

const getUserListNoti = async (match) => {
    return await notificationModel.aggregate([
        {
            $match: match
        }, {
            $project: {
                notiType: 1,
                notiSenderId: 1,
                notiReceiverId: 1,
                notiContent: {
                    $concat: [
                        {
                            $substr: ['$notiOptions.shopId', 0, -1]
                        },
                        ' has added a new product: ',
                        {
                            $substr: ['$notiOptions.productName', 0, -1]
                        }
                    ]
                },
                notiOptions: 1,
                createdAt: 1
            }
        }
    ])
}

module.exports = {
    insertNotification,
    getUserListNoti
}