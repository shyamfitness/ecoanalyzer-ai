import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/ecoanalyzer';

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI || DEFAULT_URI;
  const dbName = process.env.MONGODB_DB_NAME || undefined;

  mongoose.set('strictQuery', false);

  try {
    await mongoose.connect(mongoUri, {
      dbName,
      autoIndex: process.env.NODE_ENV !== 'production',
    });

    console.log(`✅ MongoDB connected (${mongoose.connection.host})`);

    mongoose.connection.on('error', (err) => {
      console.error('⚠️ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed');
    console.error(error);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  await mongoose.connection.close();
};

