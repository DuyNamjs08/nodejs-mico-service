const workerpool = require("workerpool");
const { saveResult, prisma } = require("../models/calculationModel");

const pool = workerpool.pool(__dirname + "/../workers/worker.js"); // Giả sử worker nằm trong thư mục `workers`

async function processAndSave(number) {
  console.log(`🚀 Bắt đầu tính toán với n = ${number}...`);

  try {
    const result = await pool.exec("heavyComputation", [number]); // Gọi worker tính toán
    console.log(`✅ Kết quả: ${result}`);

    await saveResult(number, result); // Lưu vào DB
  } catch (error) {
    console.error("❌ Lỗi xử lý:", error);
  } finally {
    await prisma.$disconnect(); // Đóng Prisma client
    pool.terminate(); // Đóng pool worker
  }
}

module.exports = { processAndSave };
