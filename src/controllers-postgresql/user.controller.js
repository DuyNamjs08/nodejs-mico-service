const { prisma } = require('../config/prisma');
const { successResponse, errorResponse } = require('../helpers/response');
const { faker } = require('@faker-js/faker');

const createUserController = async (req, res) => {
  const { email, name } = req.body;
  try {
    const response = await prisma.user.create({
      data: { email, name },
    });
    if (!response) {
      return errorResponse(res, 'Tạo user không thành công', {}, 400);
    }
    return successResponse(res, 'Tạo user thành công', response);
  } catch (error) {
    console.error('error', error);
    return errorResponse(res, 'Tạo user không thành công', error, 500);
  }
};
const fakerDataInsert = async (req, res) => {
  try {
    const BATCH_SIZE = 1000; // Insert theo từng batch để tránh quá tải
    const TOTAL = 20000;

    for (let i = 0; i < TOTAL; i += BATCH_SIZE) {
      const users = Array.from({ length: BATCH_SIZE }).map(() => ({
        email: faker.internet.email(),
        name: faker.person.fullName(),
        createdAt: faker.date.past(), // có thể dùng now() nếu muốn
      }));

      await prisma.user.createMany({
        data: users,
        skipDuplicates: true, // bỏ qua email trùng nếu có
      });

      console.log(`Inserted batch ${i + BATCH_SIZE}/${TOTAL}`);
    }
    return successResponse(res, 'Tạo nhiều user thành công', {});
  } catch (error) {
    console.error('error', error);
    return errorResponse(res, 'Tạo nhiều user không thành công', error, 500);
  }
};

module.exports = { createUserController, fakerDataInsert };
