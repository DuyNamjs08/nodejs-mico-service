const Redis = require("ioredis");
const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});

const pubRedis = async (channel, message) => {
  const publisher = redisClient.duplicate();
  await publisher.on("ready", () => {
    console.log("✅ Publisher connected");
  });
  await publisher.on("error", (err) => {
    console.error("❌ Redis publisher error:", err);
  });
  return publisher.publish(channel, message);
};
const subRedis = async (channel, callback) => {
  const subscribe = redisClient.duplicate();
  await subscribe.on("ready", () => {
    console.log("✅ Subscriber connected");
  });
  await subscribe.on("error", (err) => {
    console.error("❌ Redis subscriber error:", err);
  });
  subscribe.subscribe(channel, (err, count) => {
    if (err) {
      console.error("Error subscribing to channel:", err);
    } else {
      console.log(`📡 Subscribed to channel: ${channel}`);
    }
  });
  subscribe.on("message", (receivedChannel, message) => {
    console.log(`message on ${receivedChannel}:`, message);
    if (receivedChannel === channel) {
      callback(message);
    }
  });
};
module.exports = {
  pubRedis,
  subRedis,
};
