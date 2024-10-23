'use strict'

const { createClient } = require('redis')
const { reservationInventory } = require('../repositories/inventory.repository')

const redisClient = createClient({
    url: 'redis://localhost:6377'
})

redisClient.on('ready', () => {
    console.log('Redis connected successfully')
})

// Kết nối Redis client và bắt lỗi
redisClient.connect().catch(err => console.log('Redis Client Error', err))

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2024_${productId}`
    const retryTimes = 10;
    const expireTime = 300000

    for (let i = 0; i < retryTimes; i++) {
        const result = await redisClient.set(key, expireTime, {
            NX: true,  // Chỉ thiết lập khóa nếu chưa tồn tại
            PX: expireTime  // Thời gian hết hạn theo mili giây
        })
        console.log(`result::`, result);
        if (result === 'OK') {
            const isReservation = await reservationInventory({
                productId, quantity, cartId
            })

            if (isReservation.modifiedCount) {
                return key
            }

        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}


const releaseLock = async (keyLock) => {
    return await redisClient.del(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}
