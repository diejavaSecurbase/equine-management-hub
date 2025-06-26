import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary-light/10 p-4">
      <div class="w-full max-w-md">
        <mat-card class="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
          <mat-card-header class="text-center pb-8">
            <div class="mx-auto mb-6 flex justify-center">
              <img src="/assets/logo/logo-equusid.svg" alt="Logo EquusID" class="w-16 h-16">
            </div>
            <div class="mx-auto mb-4 flex justify-center">
              <img src="/assets/logo/logo-texto.svg" alt="Logo texto EquusID" class="h-10">
            </div>
            <mat-card-subtitle class="text-gray-600 mt-2 font-roboto-condensed">
              Ingresa tus credenciales para acceder al sistema
            </mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Correo Electrónico</mat-label>
                <input matInput 
                       type="email" 
                       formControlName="email"
                       placeholder="tu@email.com"
                       required>
                <mat-icon matSuffix>email</mat-icon>
                <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                  El email es requerido
                </mat-error>
                <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                  Ingresa un email válido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Contraseña</mat-label>
                <input matInput 
                       [type]="hidePassword ? 'password' : 'text'"
                       formControlName="password"
                       placeholder="••••••••"
                       required>
                <button mat-icon-button 
                        matSuffix 
                        type="button"
                        (click)="hidePassword = !hidePassword">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                  La contraseña es requerida
                </mat-error>
              </mat-form-field>

              <button mat-raised-button 
                      type="submit"
                      color="primary"
                      class="w-full h-12 gradient-primary text-white font-medium font-roboto-condensed shadow-lg"
                      [disabled]="loginForm.invalid || isLoading">
                <mat-spinner *ngIf="isLoading" diameter="20" class="mr-2"></mat-spinner>
                {{isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}}
              </button>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // Redirect if already authenticated
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (success) => {
          this.isLoading = false;
          if (success) {
            this.router.navigate(['/dashboard']);
          }
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }
}