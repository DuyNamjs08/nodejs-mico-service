const Redis = require('ioredis');
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

class RedisPubSub {
  constructor() {
    this.subscriber = redisClient.duplicate();
    this.publisher = redisClient.duplicate();

    this.subscriber.on('ready', () => {
      console.log('✅ Subscriber connected');
    });

    this.publisher.on('ready', () => {
      console.log('✅ Publisher connected');
    });

    this.subscriber.on('error', (err) => {
      console.error('❌ Redis subscriber error:', err);
    });

    this.publisher.on('error', (err) => {
      console.error('❌ Redis publisher error:', err);
    });
  }

  async publish(channel, message) {
    try {
      console.log(`📤 Publishing to ${channel}:`, message);
      return await this.publisher.publish(channel, message);
    } catch (err) {
      console.error('Error publishing message:', err);
      throw err;
    }
  }

  subscribe(channel, callback) {
    this.subscriber.subscribe(channel, (err, count) => {
      if (err) {
        console.error('Error subscribing to channel:', err);
      } else {
        console.log(`📡 Subscribed to channel: ${channel}`);
      }
    });

    this.subscriber.on('message', (receivedChannel, message) => {
      console.log(`📥 Message on ${receivedChannel}:`, message);
      if (receivedChannel === channel) {
        callback(message);
      }
    });
  }

  close() {
    this.subscriber.quit();
    this.publisher.quit();
  }
}

module.exports = new RedisPubSub();
