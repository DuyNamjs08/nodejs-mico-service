const autocannon = require('autocannon');

autocannon(
  {
    url: 'http://localhost:3000',
    connections: 500, // 500 request đồng thời
    duration: 20, // Chạy trong 20 giây
  },
  console.log
);
