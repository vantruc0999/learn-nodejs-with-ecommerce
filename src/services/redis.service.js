'use strict'

const redis = require('redis')
const { promisify } = require('util')
const { reservationInventory } = require('../repositories/inventory.repository')
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2024_${productId}`
    const retryTimes = 10;
    const expireTime = 3000

    for (let i = 0; i < retryTimes; i++) {
        const result = await setnxAsync(key, expireTime)
        console.log(`result::`, result);
        if (result === 1) {
            const isReservation = await reservationInventory({
                productId, quantity, cartId
            })

            if (isReservation.modifiedCount) {
                await pexpire(key, expireTime)
                return key
            }

        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async (keyLock) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}