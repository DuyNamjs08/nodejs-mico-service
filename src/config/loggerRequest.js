const logger = require('./logger');

// Middleware để log yêu cầu API
const logRequest = (req, res, next) => {
  const { method, url, headers, body } = req;
  // Log header (cẩn thận với thông tin nhạy cảm)
  logger.debug(
    `Request Headers: ${JSON.stringify(
      headers
    )}- Incoming request: ${method} ${url}`
  );
  // Log body nếu cần (trong trường hợp POST, PUT, PATCH)
  if (Object.keys(body).length) {
    logger.debug(`Request Body: ${JSON.stringify(body)}`);
  }

  // Tiến hành xử lý yêu cầu
  next();
};
module.exports = logRequest;
