const redisPubSubService = require('../services/redis-pub-sub.service')

class InventoryServiceTest {
    constructor() {
        redisPubSubService.subscribe('purchase_events', (channel, message) => {
            const order = JSON.parse(message)
            InventoryServiceTest.updateInventory(order.productId, order.quantity)
        })
    }

    static updateInventory(productId, quantity) {
        console.log(`Updated inventory for product ${productId} with quantity ${quantity}`);
    }
}

module.exports = new InventoryServiceTest()
