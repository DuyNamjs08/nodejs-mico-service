const logError = (err, req, res, next) => {
  if (err) {
    logger.error(`Error occurred in ${req.method} ${req.url}: ${err.message}`);
    logger.error(`Stack Trace: ${err.stack}`);
  }

  // Tiếp tục xử lý lỗi và phản hồi
  res.status(500).json({ message: "Internal Server Error" });
};
