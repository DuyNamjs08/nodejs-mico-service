const { prisma } = require("../config/prisma");
const { getRandomElement } = require("../helpers");
const { successResponse, errorResponse } = require("../helpers/response");
const { faker } = require("@faker-js/faker");
const createProductController = async (req, res) => {
  const { name, price, description } = req.body;
  try {
    const shops = await prisma.shop.findMany({
      select: { id: true },
      take: 1000,
    });
    const shopIds = shops.map((shop) => shop.id);
    const response = await prisma.product.create({
      data: {
        name,
        price,
        description,
        shopId: getRandomElement(shopIds), // Lấy ngẫu nhiên một shopId từ danh sách
      },
    });
    if (!response) {
      return errorResponse(res, "Tạo product không thành công", {}, 400);
    }
    return successResponse(res, "Tạo product thành công", response);
  } catch (error) {
    console.error("error", error);
    return errorResponse(res, "Tạo product không thành công", error, 500);
  }
};
const fakerDataproductInsert = async (req, res) => {
  try {
    const BATCH_SIZE = 1000; // Insert theo từng batch để tránh quá tải
    const TOTAL = 30000;
    const shops = await prisma.user.findMany({
      select: { id: true },
      take: 1000,
    });
    const shopIds = shops.map((user) => user.id);
    for (let i = 0; i < TOTAL; i += BATCH_SIZE) {
      const products = Array.from({ length: BATCH_SIZE }).map(() => ({
        name: faker.commerce.productName(),
        price: faker.number.int({ min: 1000, max: 10000000 }),
        description: faker.commerce.productDescription(),
        shopId: getRandomElement(shopIds),
        createdAt: faker.date.past(), // có thể dùng now() nếu muốn
      }));

      await prisma.product.createMany({
        data: products,
      });

      console.log(`Inserted batch ${i + BATCH_SIZE}/${TOTAL}`);
    }
    return successResponse(res, "Tạo nhiều product thành công", {});
  } catch (error) {
    console.error("error", error);
    return errorResponse(res, "Tạo nhiều product không thành công", error, 500);
  }
};

module.exports = { createProductController, fakerDataproductInsert };
