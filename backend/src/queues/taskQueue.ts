import { Queue, Worker } from 'bullmq';
import { redisClient } from '../redis';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  db: parseInt(process.env.REDIS_DB || '0'),
};

export const taskQueue = new Queue('tasks', { connection });

taskQueue.on('progress', (job) => {
  console.log(`[Queue] Job ${job.id} progress updated`);
});

taskQueue.on('completed', (job) => {
  console.log(`[Queue] Job ${job.id} completed`);
});

taskQueue.on('failed', (job, error) => {
  console.log(`[Queue] Job ${job?.id} failed:`, error?.message);
});

export default taskQueue;
