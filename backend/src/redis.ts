import { createClient } from 'redis';

export const redisClient = createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  db: parseInt(process.env.REDIS_DB || '0'),
} as any);

export async function connectRedis() {
  try {
    await redisClient.connect();
    console.log('✓ Redis connected successfully');
    return true;
  } catch (error) {
    console.error('✗ Redis connection failed:', error);
    return false;
  }
}

export async function disconnectRedis() {
  try {
    await redisClient.disconnect();
    console.log('✓ Redis disconnected');
  } catch (error) {
    console.error('✗ Redis disconnection error:', error);
  }
}

export default redisClient;
