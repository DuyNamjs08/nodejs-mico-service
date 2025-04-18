const cluster = require("cluster");
const os = require("os");
const numCPUs = os.cpus().length;
const numsWorker = Math.min(4, numCPUs);
const compression = require("compression");
const calculationRoutes = require("./src/routes/calculationRoutes");
const { prisma } = require("./src/models/calculationModel");
const redisClient = require("./src/config/redis-config");
const logger = require("./src/config/logger");
const { processUpload } = require("./src/controllers/data4gController");
const multer = require("multer");
const ProductServiceTest = require("./src/test/product.test");
const connectDB = require("./src/config/mongoDb.config");
const connectToTypeOrm = require("./src/config/typeorm");
const commentRoutes = require("./src/routes/comments/index");
const productRoutes = require("./src/routes/products/index");
const notiRoutes = require("./src/routes/notifications/index");
const postgresqlRoutes = require("./src/routes/postgresql/index");
const typeormRoutes = require("./src/routes/typeorm/index");
const redisRoutes = require("./src/routes/redis/index");

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);
//   process.title = "Master Process";

//   const restartLimits = {}; // Theo dõi số lần restart trong khoảng thời gian
//   const RESTART_THRESHOLD = 5; // Giới hạn số lần restart
//   const TIME_FRAME = 60 * 1000; // 60 giây

//   for (let i = 0; i < numsWorker; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     console.log(
//       `Worker ${worker.process.pid} died (code: ${code}, signal: ${signal})`
//     );

//     const workerId = worker.id;
//     if (!restartLimits[workerId]) {
//       restartLimits[workerId] = [];
//     }
//     // console.log("restartLimits>???", restartLimits);
//     const now = Date.now();
//     restartLimits[workerId] = restartLimits[workerId].filter(
//       (timestamp) => now - timestamp < TIME_FRAME
//     );
//     // console.log(restartLimits[workerId]);
//     restartLimits[workerId].push(now);

//     if (restartLimits[workerId].length > RESTART_THRESHOLD) {
//       console.error(
//         `Worker ${worker.process.pid} restarted too many times, stopping auto-restart.`
//       );
//       return;
//     }

//     setTimeout(() => {
//       const newWorker = cluster.fork();
//       console.log(`New worker ${newWorker.process.pid} started`);
//     }, 3000); // Delay 3s trước khi restart
//   });
// } else {
const express = require("express");
const app = express();
connectDB();
connectToTypeOrm();
app.use(express.json());
const upload = multer({ dest: "uploads/" });

app.use(
  compression({
    threshold: 1024,
    filter: (req, res) => {
      console.log("Compression check for:", req.url);
      return compression.filter(req, res);
    },
  })
);
// redisClient.on("ready", async () => {
//   console.log("Redis is ready!");

//   try {
//     // 👉 Đăng ký subscriber TRƯỚC
//     require("./src/test/inventory.test");
//     // 👉 Sau đó mới publish message
//     await ProductServiceTest.purchaseProduct("product:001", 10);
//   } catch (err) {
//     console.error("Error during test:", err);
//   } finally {
//     // Delay một chút để Redis có thời gian gửi/nhận message
//     setTimeout(() => {
//       redisClient.quit();
//     }, 300);
//   }
// });

// redisClient.on("error", (err) => {
//   console.error("Redis connection failed:", err);
// });
async function checkConnections() {
  const result = await prisma.$queryRaw`
    SELECT count(*)
    FROM pg_stat_activity
    WHERE datname = 'test_db'
  `;
  console.log(`Số kết nối hiện tại: ${result[0].count}`);
}

// checkConnections().finally(() => prisma.$disconnect());
// logger.error("An error occurred");
app.get("/", (req, res) => {
  console.log(`Worker ${process.pid} is processing request`);
  // const bigData = "a".repeat(5000);
  // return res.json({
  //   message: `Worker ${process.pid} is handling this request`,
  //   data: "bigData",
  // });
  return res.send(`Worker ${process.pid} is handling this request`);
});
app.use("/api/redis/", redisRoutes);
app.use("/api/typeorm/", typeormRoutes);
app.use("/api/postgresql/", postgresqlRoutes);
app.use("/api", notiRoutes);
app.use("/api", productRoutes);
app.use("/api", commentRoutes);
app.use("/api", calculationRoutes);
app.use("/data4g", upload.single("file"), processUpload);

app.listen(4000, () => console.log(`Worker ${process.pid} started`));

// Simulate random worker crash (chỉ để test)
// setTimeout(() => {
//   console.log(`Worker ${process.pid} is simulating a crash...`);
//   process.exit(1); // Thoát với mã lỗi 1
// }, Math.random() * 30000 + 10000); // Random từ 10-40s
// }
