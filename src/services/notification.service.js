"use strict";

const { NotFound } = require("../core/error.response");
const { insertNotification, getUserListNoti } = require("../repositories/notification.repository");

class NotificationService {
    static async pushNotiToSystem({
        type = 'SHOP-001',
        receiverId = 1,
        senderId = 1,
        options = {}
    }) {
        let notiContent

        if (type === 'SHOP-001') {
            notiContent = `@@@ has added a new product: @@@`
        } else if (type === 'PROMOTION-001') {
            notiContent = `@@@ has added a new voucher: @@@`
        }

        const newNoti = await insertNotification({ type, notiContent, senderId, receiverId, options })

        return newNoti
    }

    static async listNotiByUser({
        userId = 1,
        type = 'ALL',
        isRead = 0
    }) {
        const match = { notiReceiverId: userId }

        if (type !== 'ALL') {
            match['notiType'] = type
        }
        console.log(match);
        return await getUserListNoti(match)
    }
}

module.exports = NotificationService;