import { taskQueue } from '../queues/taskQueue';
import { createTask, getTask, getAllTasks } from '../services/taskService';

/**
 * Add a task to the processing queue
 */
export async function enqueueTask(name: string, description: string) {
  try {
    const task = await createTask(name, description);
    
    await taskQueue.add(
      'process-task',
      { taskId: task.id, name, description },
      {
        delay: 1000, // Delay 1 second before processing
        attempts: 3, // Retry up to 3 times
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      }
    );
    
    console.log(`[Queue] Task ${task.id} enqueued for processing`);
    return task;
  } catch (error) {
    console.error('[Queue] Error enqueuing task:', error);
    throw error;
  }
}

/**
 * Get task by ID (HTTP handler)
 */
export async function getTaskById(taskId: string) {
  return await getTask(taskId);
}

/**
 * Get all tasks (HTTP handler)
 */
export async function listAllTasks() {
  return await getAllTasks();
}
