const { subRedis } = require("../../services/Redis.service");

const subRedisTest = async () => {
  try {
    await subRedis("purchase-event", (message) => {
      console.log(`Received message on purchase-event channel: ${message}`);
    });
  } catch (error) {
    console.error("Error publishing purchase message:", error);
    throw error;
  }
};
subRedisTest();
module.exports = {
  subRedisTest,
};
