"use strict"

const amqp = require('amqplib')

async function producerOrderedMessage() {
    const connection = await amqp.connect('amqp://guest:123456@localhost')
    const channel = await connection.createChannel()

    const queueName = 'ordered-queued-message'
    await channel.assertQueue(queueName, {
        durable: true
    })

    for (let i = 0; i < 10; i++) {
        const message = `ordered-queue-message::${i}`
        console.log(`message: ${message}`)
        channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true
        })
    }

    setTimeout(() => {
        connection.close()
    }, 1000)
}

producerOrderedMessage().catch(err => console.err(err))