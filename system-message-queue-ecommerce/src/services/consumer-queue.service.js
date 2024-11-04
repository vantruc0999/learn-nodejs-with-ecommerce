"use strict"

const { consumerQueue, connectToRabbitMQ } = require("../dbs/init.rabbitmq")

const messageService = {
    consumerToQueue: async (queueName) => {
        try {
            const { channel, connection } = await connectToRabbitMQ()
            await consumerQueue(channel, queueName)
        } catch (error) {
            console.error(`Error consumerToQueue::`, error)
        }
    },

    //case processing
    consumerToQueueNormal: async (queueName) => {
        try {
            const { channel, connection } = await connectToRabbitMQ()

            const notiQueue = 'notificationQueueProcess' //assertQueue

            //1. TTL
            // const expirationTime = 15000
            // setTimeout(() => {
            //     channel.consume(notiQueue, (msg) => {
            //         console.log(`SEND notficationQueue successfully processed: `, msg.content.toString());
            //         channel.ack(msg)
            //     })
            // }, expirationTime)

            //2.LOGIC
            channel.consume(notiQueue, (msg) => {
                try {
                    const numberTest = Math.random()
                    console.log({ numberTest })
                    if (numberTest < 0.8) {
                        throw new Error('Send notification failed:: HOT FIX')
                    }
                    console.log(`SEND notificationQueue successfully processed:`, msg.content.toString());
                    channel.ack(msg)
                } catch (error) {
                    channel.nack(msg, false, false)
                }
            })

        } catch (error) {
            console.error(error)
        }
    },

    consumerToQueueFailed: async (queueName) => {
        try {
            const { channel, connection } = await connectToRabbitMQ()

            const notificationExchangeDLX = 'notificationExDLX' //notificationEx direct
            const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX' //assert
            const notiQueueHandler = 'notificationQueueHotFix'

            await channel.assertExchange(notificationExchangeDLX, 'direct', {
                durable: true
            })

            const queueResult = await channel.assertQueue(notiQueueHandler, {
                exclusive: false
            })

            await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX)

            await channel.consume(queueResult.queue, msgFailed => {
                console.log(`this notfication error, please hot fix::`, msgFailed.content.toString())
            }, {
                noAck: true
            })
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}

module.exports = messageService