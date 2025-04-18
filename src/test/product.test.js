const RedisPubSub = require("../services/RedisPubSub.service");
class ProductServiceTest {
  purchaseProduct = async (productId, quantity) => {
    try {
      const message = JSON.stringify({ productId, quantity });
      await RedisPubSub.publish("purchase-event", message);
      // return message;
    } catch (error) {
      console.error("Error publishing purchase message:", error);
      throw error;
    }
  };
}
module.exports = new ProductServiceTest();
