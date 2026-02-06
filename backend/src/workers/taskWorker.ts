import { Worker } from 'bullmq';
import dotenv from 'dotenv';
import { updateTaskStatus, getTask } from '../services/taskService';

dotenv.config();

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  db: parseInt(process.env.REDIS_DB || '0'),
};

/**
 * Simulate async task processing
 * This could be database operations, file processing, API calls, etc.
 */
async function processTask(taskId: string, name: string, description: string) {
  console.log(`\n[Worker] Starting task: ${taskId}`);
  console.log(`         Name: ${name}`);
  console.log(`         Description: ${description}`);
  
  try {
    await updateTaskStatus(taskId, 'processing', 10);
    
    const steps = 5;
    for (let i = 1; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const progress = Math.min(20 + (i * 16), 90);
      console.log(`[Worker] Task ${taskId} progress: ${progress}%`);
      await updateTaskStatus(taskId, 'processing', progress);
    }
    
    const result = {
      processedAt: new Date().toISOString(),
      itemsProcessed: Math.floor(Math.random() * 1000) + 100,
      successRate: (Math.random() * 0.2 + 0.8).toFixed(2), // 80-100%
      executionTime: '~10 seconds',
    };
    
    await updateTaskStatus(taskId, 'completed', 100, result);
    console.log(`[Worker] Task ${taskId} completed successfully\n`);
    
    return result;
  } catch (error: any) {
    console.error(`[Worker] Task ${taskId} failed:`, error.message);
    await updateTaskStatus(taskId, 'failed', 0, undefined, error.message);
    throw error;
  }
}

/**
 * Create and start worker
 */
const worker = new Worker(
  'tasks',
  async (job) => {
    const { taskId, name, description } = job.data;
    
    console.log(`[Worker] Processing job ${job.id}`);
    
    return processTask(taskId, name, description);
  },
  { connection, concurrency: 2 }
);

/**
 * Worker event listeners
 */
worker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} completed`);
});

worker.on('failed', (job, error) => {
  console.log(`[Worker] Job ${job?.id} failed:`, error?.message);
});

worker.on('error', (error) => {
  console.error('[Worker] Unexpected error:', error);
});

console.log(`\n✓ Task worker started`);
console.log(`✓ Redis connection: ${connection.host}:${connection.port}`);
console.log(`✓ Listening for tasks...\n`);

/**
 * Graceful shutdown
 */
process.on('SIGINT', async () => {
  console.log('\n\n[Worker] Shutting down gracefully...');
  await worker.close();
  process.exit(0);
});
