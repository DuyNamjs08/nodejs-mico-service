const logResponse = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (body) {
    // Ghi log mã trạng thái và body của phản hồi
    logger.info(`Response: ${res.statusCode} ${req.method} ${req.url}`);
    logger.debug(`Response Body: ${body}`);

    // Tiếp tục gửi phản hồi
    originalSend.call(this, body);
  };

  next();
};
