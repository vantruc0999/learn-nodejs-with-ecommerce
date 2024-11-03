const redisPubSubService = require('../services/redis-pub-sub.service')

class ProductServiceTest {
    purchaseProduct(productId, quantity) {
        const order = {
            productId,
            quantity
        }
        console.log('productId', productId);
        redisPubSubService.publish('purchase_events', JSON.stringify(order))
            .then((reply) => {
                console.log(`Order published: ${reply}`);
            })
            .catch((err) => {
                console.error('Error publishing order:', err);
            })
    }
}

module.exports = new ProductServiceTest()
