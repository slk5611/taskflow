/**
 * Task model representing the structure of a task in the system
 */
export interface Task {
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
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}
