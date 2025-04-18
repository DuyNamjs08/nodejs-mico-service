const express = require("express");
const cluster = require("cluster");
const os = require("os");
const Redis = require("ioredis");
const { RateLimiterRedis } = require("rate-limiter-flexible");
const pino = require("pino");
const prometheus = require("prom-client");

// Logging setup
const logger = pino({
  level: "info",
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
});

// Prometheus metrics
prometheus.collectDefaultMetrics();
const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
});

// Redis connection for rate limiting and caching
const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});

// Rate limiter configuration
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 100, // 100 requests
  duration: 1, // per 1 second
});

// Rate limit middleware
const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send("Too Many Requests");
    });
};

// Main service function
const createServer = () => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(rateLimiterMiddleware);

  // Performance tracking middleware
  app.use((req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;

      httpRequestDurationMicroseconds
        .labels(req.method, req.route?.path || req.path, res.statusCode)
        .observe(duration);

      logger.info({
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration: duration,
      });
    });

    next();
  });

  // Example endpoint with caching
  app.get("/users/:id", async (req, res) => {
    const userId = req.params.id;

    try {
      // Check cache first
      const cachedUser = await redisClient.get(`user:${userId}`);

      if (cachedUser) {
        return res.json(JSON.parse(cachedUser));
      }

      // Simulate database fetch
      const user = await fetchUserFromDatabase(userId);

      // Cache result
      await redisClient.set(
        `user:${userId}`,
        JSON.stringify(user),
        "EX",
        3600 // 1 hour expiration
      );

      res.json(user);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Metrics endpoint for Prometheus
  app.get("/metrics", async (req, res) => {
    res.set("Content-Type", prometheus.register.contentType);
    res.end(await prometheus.register.metrics());
  });

  // Health check
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      uptime: process.uptime(),
    });
  });

  return app;
};

// Simulate database fetch
async function fetchUserFromDatabase(userId) {
  // In real scenario, this would be a database query
  return {
    id: userId,
    name: `User ${userId}`,
    createdAt: new Date(),
  };
}

// Cluster setup for multi-core utilization
if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  logger.info(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Replace the dead worker
  });
} else {
  const app = createServer();
  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    logger.info(`Worker ${process.pid} started on port ${PORT}`);
  });
}

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

module.exports = createServer;
