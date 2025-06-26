import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    message: string;
    type: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  private readonly BASE_URL = 'http://localhost:8090';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  get<T>(endpoint: string, params?: Record<string, string>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        httpParams = httpParams.append(key, value);
      });
    }

    return this.http.get<ApiResponse<T>>(`${this.BASE_URL}${endpoint}`, { params: httpParams })
      .pipe(
        map(response => this.handleResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  post<T>(endpoint: string, data?: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.BASE_URL}${endpoint}`, data)
      .pipe(
        map(response => this.handleResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  put<T>(endpoint: string, data?: any): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${this.BASE_URL}${endpoint}`, data)
      .pipe(
        map(response => this.handleResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  patch<T>(endpoint: string, data?: any): Observable<T> {
    return this.http.patch<ApiResponse<T>>(`${this.BASE_URL}${endpoint}`, data)
      .pipe(
        map(response => this.handleResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(`${this.BASE_URL}${endpoint}`)
      .pipe(
        map(response => this.handleResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  private handleResponse<T>(response: ApiResponse<T>): T {
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.message || 'Error en la petición');
    }
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Error en la petición';
    
    if (error.status === 403) {
      sessionStorage.removeItem('token');
      window.location.href = '/login';
      errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    this.snackBar.open(errorMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });

    return throwError(() => new Error(errorMessage));
  }
}