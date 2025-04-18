const winston = require("winston");
require("winston-daily-rotate-file");

const transport = new winston.transports.DailyRotateFile({
  filename: "logs/%DATE%-results.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
});

// Cấu hình logger với Winston
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp(), // Thêm timestamp vào log
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    // Transport ghi log vào console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Thêm màu sắc cho console
        winston.format.simple() // Định dạng đơn giản
      ),
    }),
    // Transport ghi log vào file app.log
    new winston.transports.File({ filename: "logs/app.log" }),
    // Transport DailyRotateFile
    transport,
  ],
});

module.exports = logger;
