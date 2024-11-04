const amqp = require('amqplib')
const messages = 'A new product: Title product'

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:123456@localhost')
        const channel = await connection.createChannel()

        const notificationExchange = 'notificationEx' //notificationEx direct
        const notiQueue = 'notificationQueueProcess' //assertQueue
        const notificationExchangeDLX = 'notificationExDLX' //notificationEx direct
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX' //assert

        //1. Create exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        })

        //2. Create queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false, //cho phep cac ket noi truy cap vao cung mot hang doi
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        })

        //3. bindQueue
        await channel.bindQueue(queueResult.queue, notificationExchange)

        //4. Send message
        const msg = 'a new product added'
        console.log(`producer msg::`, msg);
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg),{
            expiration: '10000'
        })

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    } catch (err) {
        console.error(err)
    }
}

runProducer().then(rs => console.log(rs)).catch(console.error)