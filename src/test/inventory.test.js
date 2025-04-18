const RedisPubSub = require('../services/RedisPubSub.service');
class InventoryServiceTest {
  constructor() {
    RedisPubSub.subscribe('purchase-event', (message) => {
      try {
        const messages = JSON.parse(message);
        InventoryServiceTest.updateInventory(
          messages.productId,
          messages.quantity
        );
      } catch (error) {
        console.error('Invalid message format:', message, error);
      }
    });
  }
  static updateInventory = async (productId, quantity) => {
    try {
      console.log(
        `Updating inventory for product ${productId} with quantity ${quantity}`
      );
    } catch (error) {
      console.error('Error publishing inventory update message:', error);
      throw error;
    }
  };
}
module.exports = new InventoryServiceTest();
