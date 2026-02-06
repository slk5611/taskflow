import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Taskflow';
  apiStatus = 'checking...';
  apiConnected = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.checkApiHealth();
  }

  /**
   * Check API health status
   */
  private checkApiHealth(): void {
    this.apiService.healthCheck().subscribe({
      next: () => {
        this.apiStatus = 'connected';
        this.apiConnected = true;
      },
      error: () => {
        this.apiStatus = 'offline';
        this.apiConnected = false;
      },
    });


    setInterval(() => {
      this.apiService.healthCheck().subscribe({
        next: () => {
          this.apiStatus = 'connected';
          this.apiConnected = true;
        },
        error: () => {
          this.apiStatus = 'offline';
          this.apiConnected = false;
        },
      });
    }, 10000);
  }
}
