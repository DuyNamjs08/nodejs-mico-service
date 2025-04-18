const { prisma } = require('../config/prisma');
const { getRandomElement, paginate } = require('../helpers');
const { successResponse, errorResponse } = require('../helpers/response');
const { faker } = require('@faker-js/faker');
const createShopController = async (req, res) => {
  const { name, address } = req.body;
  try {
    const users = await prisma.user.findMany({
      select: { id: true },
      take: 1000,
    });
    const userIds = users.map((user) => user.id);
    const response = await prisma.shop.create({
      data: {
        address,
        name,
        userId: getRandomElement(userIds), // Lấy ngẫu nhiên một userId từ danh sách
      },
    });
    if (!response) {
      return errorResponse(res, 'Tạo shop không thành công', {}, 400);
    }
    return successResponse(res, 'Tạo shop thành công', response);
  } catch (error) {
    console.error('error', error);
    return errorResponse(res, 'Tạo shop không thành công', error, 500);
  }
};
const getShopController = async (req, res) => {
  const { take = 1000, skip = 1 } = req.body;
  const pagination = paginate(skip, take);
  try {
    const response = await prisma.shop.findMany({
      take: 1000,
      ...pagination,
      include: {
        user: true,
      },
    });
    return successResponse(res, 'get danh sách shop thành công', response);
  } catch (error) {
    console.error('error', error);
    return errorResponse(
      res,
      'get danh sách shop không thành công',
      error,
      500
    );
  }
};
const fakerDataShopInsert = async (req, res) => {
  try {
    const BATCH_SIZE = 1000; // Insert theo từng batch để tránh quá tải
    const TOTAL = 30000;
    const users = await prisma.user.findMany({
      select: { id: true },
      take: 1000,
    });
    const userIds = users.map((user) => user.id);
    for (let i = 0; i < TOTAL; i += BATCH_SIZE) {
      const shops = Array.from({ length: BATCH_SIZE }).map(() => ({
        address: faker.location.streetAddress(),
        name: faker.person.fullName(),
        userId: getRandomElement(userIds),
        createdAt: faker.date.past(), // có thể dùng now() nếu muốn
      }));

      await prisma.shop.createMany({
        data: shops,
      });

      console.log(`Inserted batch ${i + BATCH_SIZE}/${TOTAL}`);
    }
    return successResponse(res, 'Tạo nhiều shop thành công', {});
  } catch (error) {
    console.error('error', error);
    return errorResponse(res, 'Tạo nhiều shop không thành công', error, 500);
  }
};

module.exports = {
  createShopController,
  fakerDataShopInsert,
  getShopController,
};
