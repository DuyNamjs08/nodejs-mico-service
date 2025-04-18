const { prisma } = require("../config/prisma");

async function saveResult(number, result) {
  try {
    await prisma.calculation.create({
      data: { number, result },
    });
    console.log(`✅ Lưu vào DB thành công: ${result}`);
  } catch (error) {
    console.error("❌ Lỗi khi lưu vào DB:", error);
  }
}

module.exports = { saveResult };
