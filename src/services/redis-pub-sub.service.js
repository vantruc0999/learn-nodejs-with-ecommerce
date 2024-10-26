'use strict'

const { createClient } = require('redis')

class RedisPubSubService {
    constructor() {
        // Create Redis client for publishing
        this.publisherClient = createClient({
            url: 'redis://localhost:6377'
        })

        // Create Redis client for subscribing
        this.subscriberClient = createClient({
            url: 'redis://localhost:6377'
        })

        // Connect the Redis clients
        this.publisherClient.connect()
        this.subscriberClient.connect()

        // Handle connection errors
        this.publisherClient.on('error', (err) => {
            console.error('Redis Publisher Client Error', err)
        })

        this.subscriberClient.on('error', (err) => {
            console.error('Redis Subscriber Client Error', err)
        })
    }

    publish(channel, message) {
        return new Promise((resolve, reject) => {
            this.publisherClient.publish(channel, message)
                .then(reply => resolve(reply))
                .catch(err => reject(err))
        })
    }

    subscribe(channel, callback) {
        this.subscriberClient.subscribe(channel, (message) => {
            callback(channel, message)
        })
    }
}

module.exports = new RedisPubSubService()
