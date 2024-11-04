const amqp = require('amqplib')
const messages = 'Hello, RabbitMQ hehe'

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:123456@localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })

        channel.sendToQueue(queueName, Buffer.from(messages))
        console.log(`message sent: `, messages);
        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    } catch (err) {
        console.error(err)
    }
}

runProducer().then(rs => console.log(rs)).catch(console.error)