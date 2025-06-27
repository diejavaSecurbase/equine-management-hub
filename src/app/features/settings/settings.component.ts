import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LayoutComponent } from '../../shared/components/layout/layout.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDividerModule,
    LayoutComponent
  ],
  template: `
    <app-layout>
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
            <p class="text-gray-600 mt-2">Administra las configuraciones generales del sistema</p>
          </div>
          <div class="flex gap-2">
            <button mat-stroked-button (click)="resetSettings()">
              <mat-icon>refresh</mat-icon>
              Restaurar
            </button>
            <button mat-raised-button 
                    color="primary" 
                    [disabled]="isLoading"
                    (click)="saveSettings()">
              <mat-icon>save</mat-icon>
              {{isLoading ? 'Guardando...' : 'Guardar Cambios'}}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Configuración General -->
          <mat-card class="shadow-md border-0">
            <mat-card-header>
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2">language</mat-icon>
                Configuración General
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <form [formGroup]="generalForm" class="space-y-4">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Nombre del Sistema</mat-label>
                  <input matInput formControlName="siteName">
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Descripción</mat-label>
                  <input matInput formControlName="siteDescription">
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Email de Administrador</mat-label>
                  <input matInput type="email" formControlName="adminEmail">
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Email de Soporte</mat-label>
                  <input matInput type="email" formControlName="supportEmail">
                </mat-form-field>
              </form>
            </mat-card-content>
          </mat-card>

          <!-- Configuración de Notificaciones -->
          <mat-card class="shadow-md border-0">
            <mat-card-header>
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2">notifications</mat-icon>
                Notificaciones
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <form [formGroup]="notificationForm" class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium">Notificaciones por Email</div>
                    <div class="text-sm text-gray-500">Recibir notificaciones vía email</div>
                  </div>
                  <mat-slide-toggle formControlName="emailNotifications"></mat-slide-toggle>
                </div>

                <mat-divider></mat-divider>

                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium">Alertas de Traslados</div>
                    <div class="text-sm text-gray-500">Notificar sobre cambios en traslados</div>
                  </div>
                  <mat-slide-toggle formControlName="travelAlerts"></mat-slide-toggle>
                </div>

                <mat-divider></mat-divider>

                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium">Recordatorios Sanitarios</div>
                    <div class="text-sm text-gray-500">Recordatorios de libretas sanitarias</div>
                  </div>
                  <mat-slide-toggle formControlName="healthBookReminders"></mat-slide-toggle>
                </div>

                <mat-divider></mat-divider>

                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium">Alertas de Mantenimiento</div>
                    <div class="text-sm text-gray-500">Notificar sobre mantenimiento del sistema</div>
                  </div>
                  <mat-slide-toggle formControlName="maintenanceAlerts"></mat-slide-toggle>
                </div>
              </form>
            </mat-card-content>
          </mat-card>

          <!-- Configuración de Seguridad -->
          <mat-card class="shadow-md border-0">
            <mat-card-header>
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2">security</mat-icon>
                Seguridad
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <form [formGroup]="securityForm" class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium">Autenticación de Dos Factores</div>
                    <div class="text-sm text-gray-500">Activar 2FA para mayor seguridad</div>
                  </div>
                  <mat-slide-toggle formControlName="twoFactorAuth"></mat-slide-toggle>
                </div>

                <mat-divider></mat-divider>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Tiempo de Sesión (minutos)</mat-label>
                  <input matInput type="number" min="5" max="480" formControlName="sessionTimeout">
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Expiración de Contraseña (días)</mat-label>
                  <input matInput type="number" min="30" max="365" formControlName="passwordExpiry">
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Intentos de Login Máximos</mat-label>
                  <input matInput type="number" min="3" max="10" formControlName="loginAttempts">
                </mat-form-field>
              </form>
            </mat-card-content>
          </mat-card>

          <!-- Configuración del Sistema -->
          <mat-card class="shadow-md border-0">
            <mat-card-header>
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2">storage</mat-icon>
                Sistema
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <form [formGroup]="systemForm" class="space-y-4">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Frecuencia de Respaldo</mat-label>
                  <mat-select formControlName="backupFrequency">
                    <mat-option value="hourly">Cada hora</mat-option>
                    <mat-option value="daily">Diario</mat-option>
                    <mat-option value="weekly">Semanal</mat-option>
                    <mat-option value="monthly">Mensual</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Retención de Logs (días)</mat-label>
                  <input matInput type="number" min="7" max="365" formControlName="logRetention">
                </mat-form-field>

                <mat-divider></mat-divider>

                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium">Cache Habilitado</div>
                    <div class="text-sm text-gray-500">Mejorar rendimiento del sistema</div>
                  </div>
                  <mat-slide-toggle formControlName="cacheEnabled"></mat-slide-toggle>
                </div>

                <mat-divider></mat-divider>

                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium">Modo Debug</div>
                    <div class="text-sm text-gray-500">Activar para desarrollo</div>
                  </div>
                  <mat-slide-toggle formControlName="debugMode"></mat-slide-toggle>
                </div>
              </form>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Estado del Sistema -->
        <mat-card class="shadow-md border-0">
          <mat-card-header>
            <mat-card-title class="flex items-center">
              <mat-icon class="mr-2">settings</mat-icon>
              Estado del Sistema
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">Activo</div>
                <div class="text-sm text-gray-500">Estado del Servidor</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">99.9%</div>
                <div class="text-sm text-gray-500">Tiempo de Actividad</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-orange-600">1.2GB</div>
                <div class="text-sm text-gray-500">Uso de Memoria</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">45MB</div>
                <div class="text-sm text-gray-500">Base de Datos</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </app-layout>
  `,
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  isLoading = false;
  
  generalForm: FormGroup;
  notificationForm: FormGroup;
  securityForm: FormGroup;
  systemForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.generalForm = this.fb.group({
      siteName: ['Sistema Equinos'],
      siteDescription: ['Back Office para gestión equina'],
      adminEmail: ['admin@sistemaequinos.com'],
      supportEmail: ['soporte@sistemaequinos.com']
    });

    this.notificationForm = this.fb.group({
      emailNotifications: [true],
      travelAlerts: [true],
      healthBookReminders: [true],
      maintenanceAlerts: [false]
    });

    this.securityForm = this.fb.group({
      twoFactorAuth: [false],
      sessionTimeout: [30],
      passwordExpiry: [90],
      loginAttempts: [5]
    });

    this.systemForm = this.fb.group({
      backupFrequency: ['daily'],
      logRetention: [30],
      cacheEnabled: [true],
      debugMode: [false]
    });
  }

  saveSettings() {
    this.isLoading = true;
    
    // Simulate save operation
    setTimeout(() => {
      this.isLoading = false;
      this.snackBar.open('Configuración guardada correctamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }, 1000);
  }

  resetSettings() {
    this.generalForm.patchValue({
      siteName: 'Sistema Equinos',
      siteDescription: 'Back Office para gestión equina',
      adminEmail: 'admin@sistemaequinos.com',
      supportEmail: 'soporte@sistemaequinos.com'
    });

    this.notificationForm.patchValue({
      emailNotifications: true,
      travelAlerts: true,
      healthBookReminders: true,
      maintenanceAlerts: false
    });

    this.securityForm.patchValue({
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5
    });

    this.systemForm.patchValue({
      backupFrequency: 'daily',
      logRetention: 30,
      cacheEnabled: true,
      debugMode: false
    });

    this.snackBar.open('Configuración restaurada a valores por defecto', 'Cerrar', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
}