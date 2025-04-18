const { uploadData4g } = require('../models/data4g');
const xlsx = require('xlsx');
const fs = require('fs');

async function processUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Không tìm thấy file',
        error: true,
      });
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    console.log(sheet);
    const excelData = xlsx.utils.sheet_to_json(sheet); // đổi tên biến 'data' để tránh trùng
    console.log(excelData);

    const result = await uploadData4g(excelData);
    if (!result) {
      return res.status(500).json({
        message: 'Lỗi khi lưu vào DB',
        error: true,
      });
    }

    fs.unlinkSync(filePath); // Xóa file tạm
    return res.status(200).json({
      message: 'Đã xử lý và lưu vào DB thành công!',
      error: false,
      result,
    });
  } catch (error) {
    console.error('❌ Lỗi xử lý:', error);
    return res.status(500).json({
      message: 'Đã xảy ra lỗi trong quá trình xử lý',
      error: true,
      details: error.message,
    });
  }
}

module.exports = { processUpload };
