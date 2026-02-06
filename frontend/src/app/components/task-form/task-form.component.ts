import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.taskService.isLoading$.subscribe((isLoading) => {
      this.isSubmitting = isLoading;
    });
  }

  /**
   * Initialize the form
   */
  private initializeForm(): void {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  /**
   * Submit the form to create a task
   */
  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    const { name, description } = this.taskForm.value;

    this.taskService.createTask(name, description).subscribe({
      next: () => {
        this.successMessage = 'Task created successfully! It is now being processed.';
        this.taskForm.reset();
        this.errorMessage = '';

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = `Error creating task: ${error.message}`;
        this.successMessage = '';
      },
    });
  }

  /**
   * Get form control for template
   */
  get name() {
    return this.taskForm.get('name');
  }

  get description() {
    return this.taskForm.get('description');
  }
}
