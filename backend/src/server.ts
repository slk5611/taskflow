import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb, disconnectDb } from './db';
import { connectRedis, disconnectRedis } from './redis';
import { taskQueue } from './queues/taskQueue';
import routes from './index';
import { requestLogger, errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4200';

/**
 * Middleware setup
 */
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

/**
 * Routes
 */
app.use('/', routes);

/**
 * Error handling
 */
app.use(errorHandler);

/**
 * Start server
 */
async function startServer() {
  try {
    const dbConnected = await connectDb();
    if (!dbConnected) {
      console.error('Failed to connect to MongoDB. Exiting.');
      process.exit(1);
    }
    
    const redisConnected = await connectRedis();
    if (!redisConnected) {
      console.error('Failed to connect to Redis. Exiting.');
      process.exit(1);
    }
    
    app.listen(PORT, () => {
      console.log(`\n✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ CORS enabled for: ${CORS_ORIGIN}`);
      console.log(`✓ Task queue initialized\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
process.on('SIGINT', async () => {
  console.log('\n\n[Server] Shutting down gracefully...');
  await disconnectDb();
  await disconnectRedis();
  await taskQueue.close();
  process.exit(0);
});

startServer();

export default app;
