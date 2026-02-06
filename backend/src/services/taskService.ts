import { v4 as uuidv4 } from 'uuid';
import Task, { ITask } from '../models/Task';

/**
 * Task interface
 */
export interface TaskDTO {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: string;
  createdAt: string;
  updatedAt: string;
  retries?: number;
}

/**
 * Create a new task in MongoDB
 */
export async function createTask(name: string, description: string): Promise<TaskDTO> {
  const taskId = uuidv4();
  
  const task = new Task({
    id: taskId,
    name,
    description,
    status: 'pending',
    progress: 0,
    retries: 0,
  });
  
  const savedTask = await task.save();
  console.log(`[Task Service] Created task: ${taskId}`);
  
  return formatTaskDTO(savedTask);
}

/**
 * Get a task by ID from MongoDB
 */
export async function getTask(taskId: string): Promise<TaskDTO | null> {
  const task = await Task.findOne({ id: taskId });
  return task ? formatTaskDTO(task) : null;
}

/**
 * Get all tasks from MongoDB
 */
export async function getAllTasks(): Promise<TaskDTO[]> {
  const tasks = await Task.find()
    .sort({ createdAt: -1 })
    .exec();
  
  return tasks.map(formatTaskDTO);
}

/**
 * Update task status in MongoDB
 */
export async function updateTaskStatus(
  taskId: string,
  status: ITask['status'],
  progress: number = 0,
  result?: any,
  error?: string
): Promise<TaskDTO | null> {
  const updateData: any = {
    status,
    progress,
    updatedAt: new Date(),
  };
  
  if (result !== undefined) {
    updateData.result = result;
  }
  
  if (error !== undefined) {
    updateData.error = error;
  }
  
  const task = await Task.findOneAndUpdate(
    { id: taskId },
    updateData,
    { new: true }
  );
  
  if (!task) {
    return null;
  }
  
  console.log(`[Task Service] Task ${taskId} status updated to: ${status}`);
  return formatTaskDTO(task);
}

/**
 * Increment retry count
 */
export async function incrementRetries(taskId: string): Promise<number | null> {
  const task = await Task.findOneAndUpdate(
    { id: taskId },
    {
      $inc: { retries: 1 },
      updatedAt: new Date(),
    },
    { new: true }
  );
  
  if (!task) {
    return null;
  }
  
  return task.retries || 0;
}

/**
 * Check if task should be retried
 */
export function shouldRetry(retries: number): boolean {
  const MAX_RETRIES = 3;
  return retries < MAX_RETRIES;
}

/**
 * Delete a task from MongoDB
 */
export async function deleteTask(taskId: string): Promise<boolean> {
  const result = await Task.deleteOne({ id: taskId });
  if (result.deletedCount > 0) {
    console.log(`[Task Service] Task ${taskId} deleted`);
    return true;
  }
  return false;
}

/**
 * Format MongoDB task to TaskDTO
 */
function formatTaskDTO(task: ITask): TaskDTO {
  return {
    id: task.id,
    name: task.name,
    description: task.description,
    status: task.status,
    progress: task.progress,
    result: task.result || undefined,
    error: task.error || undefined,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    retries: task.retries || 0,
  };
}
