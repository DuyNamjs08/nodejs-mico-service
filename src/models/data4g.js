const { prisma } = require('../config/prisma');

async function uploadData4g(data) {
  console.log(data);
  const { e_node_b, e_utra_cell, month, vo_lte_erab_succ } = data;
  try {
    await prisma.data4G.create({
      data: { e_node_b, e_utra_cell, month, vo_lte_erab_succ },
    });
    return 1;
  } catch (error) {
    console.error('❌ Lỗi khi lưu vào DB:', error);
  }
}

module.exports = { uploadData4g };
