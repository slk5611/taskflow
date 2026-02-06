import { Schema, model, Document } from 'mongoose';

/**
 * Task interface for TypeScript type checking
 */
export interface ITask extends Document {
  _id?: string;
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  retries?: number;
}

/**
 * Task MongoDB Schema
 */
const TaskSchema = new Schema<ITask>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    result: {
      type: Schema.Types.Mixed,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
    retries: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'tasks',
  }
);

/**
 * Task Model
 */
export const Task = model<ITask>('Task', TaskSchema);

export default Task;
