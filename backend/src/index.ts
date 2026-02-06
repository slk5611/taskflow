import express, { Router } from 'express';
import {
  createTaskHandler,
  listTasksHandler,
  getTaskHandler,
  healthHandler,
} from './taskRoutes';

const router: Router = express.Router();

/**
 * Task endpoints
 */
router.post('/tasks', createTaskHandler);
router.get('/tasks', listTasksHandler);
router.get('/tasks/:id', getTaskHandler);

/**
 * Health check
 */
router.get('/health', healthHandler);

export default router;
