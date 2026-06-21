import mongoose from 'mongoose';

export let isUsingMongo = false;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri || mongoUri.trim() === '') {
    console.log('⚠️  MONGO_URI trống. Sử dụng Cơ sở dữ liệu JSON cục bộ (server/db.json) làm dự phòng. 📁');
    isUsingMongo = false;
    return;
  }

  try {
    // Set connection timeout to 5 seconds so it fails fast if server is offline
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    isUsingMongo = true;
    console.log('🍃 MongoDB connected successfully! Kết nối CSDL đám mây hoạt động.');
  } catch (error) {
    console.log('❌ Kết nối MongoDB thất bại:', (error as Error).message);
    console.log('⚠️  Tự động chuyển sang CSDL JSON cục bộ (server/db.json) làm dự phòng. 📁');
    isUsingMongo = false;
  }
};
