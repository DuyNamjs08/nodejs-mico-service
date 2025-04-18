const { prisma } = require('../config/prisma');
const { getRandomElement, paginate } = require('../helpers');
const { successResponse, errorResponse } = require('../helpers/response');
const { faker } = require('@faker-js/faker');
const createOrderController = async (req, res) => {
  const { quantity, status } = req.body;
  try {
    const users = await prisma.user.findMany({
      select: { id: true },
      take: 1000,
    });
    const userIds = users.map((user) => user.id);
    const shops = await prisma.shop.findMany({
      select: { id: true },
      take: 1000,
    });
    const shopIds = shops.map((shop) => shop.id);
    const products = await prisma.product.findMany({
      select: { id: true },
      take: 1000,
    });
    const productIds = products.map((product) => product.id);
    const response = await prisma.order.create({
      data: {
        quantity,
        status,
        userId: getRandomElement(userIds),
        shopId: getRandomElement(shopIds),
        productId: getRandomElement(productIds),
      },
    });
    if (!response) {
      return errorResponse(res, 'Tạo order không thành công', {}, 400);
    }
    return successResponse(res, 'Tạo order thành công', response);
  } catch (error) {
    console.error('error', error);
    return errorResponse(res, 'Tạo order không thành công', error, 500);
  }
};
const getOrderController = async (req, res) => {
  const { take = 1000, skip = 1 } = req.body;
  const pagination = paginate(skip, take);
  try {
    const response = await prisma.order.findMany({
      take: 1000,
      ...pagination,
      include: {
        user: true,
        shop: true,
        product: true,
      },
    });
    return successResponse(res, 'get danh sách order thành công', response);
  } catch (error) {
    console.error('error', error);
    return errorResponse(
      res,
      'get danh sách order không thành công',
      error,
      500
    );
  }
};
const fakerDataorderInsert = async (req, res) => {
  try {
    const BATCH_SIZE = 1000; // Insert theo từng batch để tránh quá tải
    const TOTAL = 30000;
    const users = await prisma.user.findMany({
      select: { id: true },
      take: 1000,
    });
    const userIds = users.map((user) => user.id);
    const shops = await prisma.shop.findMany({
      select: { id: true },
      take: 1000,
    });
    const shopIds = shops.map((shop) => shop.id);
    const products = await prisma.product.findMany({
      select: { id: true },
      take: 1000,
    });
    const productIds = products.map((product) => product.id);
    for (let i = 0; i < TOTAL; i += BATCH_SIZE) {
      const orders = Array.from({ length: BATCH_SIZE }).map(() => ({
        status: faker.helpers.arrayElement([
          'pending',
          'completed',
          'cancelled',
          'shipped',
          'refunded',
        ]),
        quantity: faker.number.int({ min: 1000, max: 10000000 }),
        userId: getRandomElement(userIds),
        shopId: getRandomElement(shopIds),
        productId: getRandomElement(productIds),
        createdAt: faker.date.past(), // có thể dùng now() nếu muốn
      }));

      await prisma.order.createMany({
        data: orders,
      });

      console.log(`Inserted batch ${i + BATCH_SIZE}/${TOTAL}`);
    }
    return successResponse(res, 'Tạo nhiều order thành công', {});
  } catch (error) {
    console.error('error', error);
    return errorResponse(res, 'Tạo nhiều order không thành công', error, 500);
  }
};

module.exports = {
  createOrderController,
  fakerDataorderInsert,
  getOrderController,
};
