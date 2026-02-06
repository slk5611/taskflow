import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Health check endpoint
   */
  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }

  /**
   * Get API base URL
   */
  getApiUrl(): string {
    return this.apiUrl;
  }
}
