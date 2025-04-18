const { createConnection, getConnection } = require('typeorm');
const connectToTypeOrm = async () => {
  try {
    // Kiểm tra nếu đã có kết nối trước đó
    try {
      const existingConnection = getConnection();
      if (existingConnection.isConnected) {
        return existingConnection;
      }
    } catch (error) {
      // Nếu chưa có kết nối thì tạo mới
    }
    const connection = await createConnection();
    console.log('✅ Connected to database by TypeORM');
    return connection;
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    throw error;
  }
};
module.exports = connectToTypeOrm;
