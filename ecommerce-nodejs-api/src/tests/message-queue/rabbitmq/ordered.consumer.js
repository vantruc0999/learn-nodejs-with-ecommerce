"use strict"

const amqp = require('amqplib')

async function consumerOrderedMessage() {
    const connection = await amqp.connect('amqp://guest:123456@localhost')
    const channel = await connection.createChannel()

    const queueName = 'ordered-queued-message'
    await channel.assertQueue(queueName, {
        durable: true
    })

    //Giới hạn mỗi consumer chỉ xử lý một thông điệp tại một thời điểm, giúp duy trì thứ tự xử lý và tránh quá tải.
    channel.prefetch(1)

    channel.consume(queueName, msg => {
        const message = msg.content.toString()

        setTimeout(() => {
            console.log(`processed: `, message);
            //Xác nhận rằng một thông điệp đã được xử lý thành công, xóa thông điệp khỏi queue để không bị xử lý lại.
            channel.ack(msg)
        }, Math.random() * 1000)
    })

}

consumerOrderedMessage().catch(err => console.err(err))