import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  isLoading = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.tasks$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = `Error loading tasks: ${error.message}`;
          this.isLoading = false;
        },
      });

    this.taskService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      });

    this.taskService.loadAllTasks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Get status color for display
   */
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      pending: '#ffc107',
      processing: '#17a2b8',
      completed: '#28a745',
      failed: '#dc3545',
    };
    return colors[status] || '#6c757d';
  }

  /**
   * Format date for display
   */
  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  /**
   * Check if task is still processing
   */
  isProcessing(task: Task): boolean {
    return task.status === 'processing';
  }

  /**
   * Get progress text
   */
  getProgressText(task: Task): string {
    if (task.status === 'completed') {
      return 'Completed';
    } else if (task.status === 'failed') {
      return 'Failed';
    }
    return `${task.progress}% Processing`;
  }
}
