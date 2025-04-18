const { pubRedis } = require("../../services/Redis.service");

const pubRedisTest = async (message) => {
  try {
    await pubRedis("purchase-event", JSON.stringify(message));
  } catch (error) {
    console.error("Error publishing purchase message:", error);
    throw error;
  }
};
pubRedisTest("test message 2");
module.exports = {
  pubRedisTest,
};
