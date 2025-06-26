import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface LoginResponse {
  success: boolean;
  data?: {
    token: string;
    user?: any;
  };
  error?: {
    message: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8090';
  private tokenSubject = new BehaviorSubject<string | null>(this.getStoredToken());
  private userSubject = new BehaviorSubject<any>(null);

  public token$ = this.tokenSubject.asObservable();
  public user$ = this.userSubject.asObservable();
  public isAuthenticated$ = this.token$.pipe(map(token => !!token));

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Initialize user data if token exists
    if (this.getToken()) {
      // You might want to validate the token or fetch user data here
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<LoginResponse>(`${this.API_URL}/equusid/admin/login`, {
      email,
      password
    }).pipe(
      map(response => {
        if (response.success && response.data?.token) {
          this.setToken(response.data.token);
          if (response.data.user) {
            this.userSubject.next(response.data.user);
          }
          this.snackBar.open('¡Bienvenido! Has iniciado sesión correctamente.', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          return true;
        } else {
          this.snackBar.open(response.error?.message || 'Credenciales inválidas.', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          return false;
        }
      }),
      catchError(error => {
        console.error('Error during login:', error);
        this.snackBar.open('No se pudo conectar con el servidor. Intenta más tarde.', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.userSubject.next(null);
    this.router.navigate(['/login']);
    this.snackBar.open('Has cerrado sesión correctamente.', 'Cerrar', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  private setToken(token: string): void {
    sessionStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  private removeToken(): void {
    sessionStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  private getStoredToken(): string | null {
    return sessionStorage.getItem('token');
  }
}