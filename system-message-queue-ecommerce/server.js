"use strict"

const { consumerToQueue, consumerToQueueNormal, consumerToQueueFailed } = require("./src/services/consumer-queue.service")
const queueName = 'test-topic'

// consumerToQueue(queueName).then(() => {
//     console.log(`Message consumer started ${queueName}`);
// }).catch(err => console.error(`Message Error: ${err.message}`))

consumerToQueueNormal(queueName).then(() => {
    console.log(`Message consumer started`);
}).catch(err => console.error(`Message Error: ${err.message}`))

consumerToQueueFailed(queueName).then(() => {
    console.log(`Message consumer started`);
}).catch(err => console.error(`Message Error: ${err.message}`))