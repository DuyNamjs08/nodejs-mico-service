const express = require('express');
const { processAndSave } = require('../controllers/calculationController');

const router = express.Router();

router.post('/calculate', async (req, res) => {
  const { number } = req.body;
  console.log(number);
  if (!number)
    return res.status(400).json({ error: 'Số đầu vào không hợp lệ' });

  try {
    await processAndSave(number);
    res.json({ message: 'Đang xử lý, vui lòng kiểm tra DB sau!' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
