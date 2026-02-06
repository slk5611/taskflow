import mongoose from 'mongoose';

/**
 * MongoDB connection setup
 */
export async function connectDb() {
  try {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017/taskflow';
    
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    
    console.log('✓ MongoDB connected successfully');
    console.log(`✓ Database: taskflow`);
    return true;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    return false;
  }
}

/**
 * MongoDB disconnection
 */
export async function disconnectDb() {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB disconnected');
  } catch (error) {
    console.error('✗ MongoDB disconnection error:', error);
  }
}

export default mongoose;
