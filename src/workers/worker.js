const workerpool = require('workerpool');

function heavyComputation(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i * i; // Tính tổng bình phương
  }
  return sum;
}

// Đăng ký function vào worker pool
workerpool.worker({
  heavyComputation,
});
