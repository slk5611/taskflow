import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Task, ApiResponse } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  private selectedTaskSubject = new BehaviorSubject<Task | null>(null);
  public selectedTask$ = this.selectedTaskSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private http: HttpClient) {
    this.startPolling();
  }

  /**
   * Start polling for task updates
   */
  private startPolling(): void {
    interval(2000)
      .pipe(
        switchMap(() => this.getAllTasks()),
        catchError((error) => {
          console.error('Error polling tasks:', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (tasks) => {
          this.tasksSubject.next(tasks);
        },
        error: (error) => {
          console.error('Polling error:', error);
        },
      });
  }

  /**
   * Create a new task
   */
  createTask(name: string, description: string): Observable<Task> {
    this.isLoadingSubject.next(true);
    return this.http
      .post<ApiResponse<Task>>(`${this.apiUrl}/tasks`, { name, description })
      .pipe(
        tap(() => this.isLoadingSubject.next(false)),
        tap((response) => {
          if (response.data) {
            this.loadAllTasks();
          }
        }),
        switchMap((response) => {
          if (response.data) {
            return new Observable((observer) => {
              observer.next(response.data!);
              observer.complete();
            });
          }
          return throwError(() => new Error('No data in response'));
        }),
        catchError((error) => {
          this.isLoadingSubject.next(false);
          return this.handleError(error);
        })
      );
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Observable<Task[]> {
    return this.http.get<ApiResponse<Task[]>>(`${this.apiUrl}/tasks`).pipe(
      tap((response) => {
        const tasks = response.data || [];
        this.tasksSubject.next(tasks);
      }),
      switchMap((response) => {
        return new Observable((observer) => {
          observer.next(response.data || []);
          observer.complete();
        });
      }),
      catchError((error) => this.handleError(error))
    );
  }

  /**
   * Get task by ID
   */
  getTask(taskId: string): Observable<Task> {
    return this.http.get<ApiResponse<Task>>(`${this.apiUrl}/tasks/${taskId}`).pipe(
      tap((response) => {
        if (response.data) {
          this.selectedTaskSubject.next(response.data);
        }
      }),
      switchMap((response) => {
        if (response.data) {
          return new Observable((observer) => {
            observer.next(response.data!);
            observer.complete();
          });
        }
        return throwError(() => new Error('Task not found'));
      }),
      catchError((error) => this.handleError(error))
    );
  }

  /**
   * Load all tasks manually
   */
  loadAllTasks(): void {
    this.getAllTasks().subscribe({
      error: (error) => console.error('Error loading tasks:', error),
    });
  }

  /**
   * Get status color for badge
   */
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      pending: 'warn',
      processing: 'accent',
      completed: 'primary',
      failed: 'error',
    };
    return colors[status] || 'primary';
  }

  /**
   * Get status icon
   */
  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      pending: 'schedule',
      processing: 'hourglass_bottom',
      completed: 'check_circle',
      failed: 'error',
    };
    return icons[status] || 'info';
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.error || error.message;
    }
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
