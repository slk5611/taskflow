import { Request, Response } from 'express';
import { enqueueTask, listAllTasks, getTaskById } from '../controllers/taskController';

/**
 * POST /tasks - Create and enqueue a new task
 */
export async function createTaskHandler(req: Request, res: Response) {
  try {
    const { name, description } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({
        error: 'Missing required fields: name, description',
      });
    }
    
    const task = await enqueueTask(name, description);
    
    res.status(201).json({
      success: true,
      message: 'Task created and queued for processing',
      data: task,
    });
  } catch (error: any) {
    console.error('[Routes] Error creating task:', error);
    res.status(500).json({
      error: 'Failed to create task',
      details: error.message,
    });
  }
}

/**
 * GET /tasks - Get all tasks
 */
export async function listTasksHandler(req: Request, res: Response) {
  try {
    const tasks = await listAllTasks();
    
    res.status(200).json({
      success: true,
      data: tasks,
      count: tasks.length,
    });
  } catch (error: any) {
    console.error('[Routes] Error listing tasks:', error);
    res.status(500).json({
      error: 'Failed to list tasks',
      details: error.message,
    });
  }
}

/**
 * GET /tasks/:id - Get task by ID
 */
export async function getTaskHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const task = await getTaskById(id);
    
    if (!task) {
      return res.status(404).json({
        error: 'Task not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    console.error('[Routes] Error getting task:', error);
    res.status(500).json({
      error: 'Failed to get task',
      details: error.message,
    });
  }
}

/**
 * Health check endpoint
 */
export async function healthHandler(req: Request, res: Response) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
}
