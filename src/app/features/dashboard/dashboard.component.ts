import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LayoutComponent } from '../../shared/components/layout/layout.component';

interface MetricCard {
  title: string;
  value: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    LayoutComponent
  ],
  template: `
    <app-layout>
      <div class="space-y-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent font-roboto-condensed">
              Dashboard
            </h1>
            <p class="text-gray-600 mt-2 font-roboto-condensed">Vista general del sistema de gestión equina</p>
          </div>
          <div class="text-sm text-gray-500 font-roboto-condensed bg-white px-4 py-2 rounded-lg shadow-sm">
            Última actualización: {{currentTime | date:'short':'es-ES'}}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <mat-card *ngFor="let metric of metrics" 
                    class="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
            <mat-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
              <mat-card-title class="text-sm font-medium text-gray-700 font-roboto-condensed">
                {{metric.title}}
              </mat-card-title>
              <div [class]="'p-3 rounded-xl border border-white/50 ' + metric.bgColor">
                <mat-icon [class]="'h-6 w-6 ' + metric.color">{{metric.icon}}</mat-icon>
              </div>
            </mat-card-header>
            <mat-card-content>
              <div class="text-3xl font-bold text-primary mb-1 font-roboto-condensed">
                {{metric.value}}
              </div>
              <div class="flex items-center justify-between">
                <p class="text-xs text-gray-600 font-roboto-condensed">
                  {{metric.description}}
                </p>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <mat-card class="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
            <mat-card-header>
              <mat-card-title class="flex items-center space-x-2 font-roboto-condensed">
                <mat-icon class="h-5 w-5 text-primary">schedule</mat-icon>
                <span>Actividad Reciente</span>
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="space-y-4">
                <div *ngFor="let activity of recentActivities" 
                     class="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-100">
                  <div>
                    <p class="text-sm font-medium text-gray-900 font-roboto-condensed">{{activity.action}}</p>
                    <p class="text-xs text-gray-500 font-roboto-condensed">{{activity.user}}</p>
                  </div>
                  <span class="text-xs text-gray-400 font-roboto-condensed">{{activity.time}}</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
            <mat-card-header>
              <mat-card-title class="flex items-center space-x-2 font-roboto-condensed">
                <mat-icon class="h-5 w-5 text-primary">flash_on</mat-icon>
                <span>Accesos Rápidos</span>
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="grid grid-cols-2 gap-4">
                <div *ngFor="let shortcut of shortcuts" 
                     [class]="shortcut.color + ' text-white p-4 rounded-xl cursor-pointer hover:scale-105 transition-transform duration-200 shadow-md font-roboto-condensed'">
                  <h3 class="font-medium text-sm">{{shortcut.title}}</h3>
                  <p class="text-xs opacity-90">{{shortcut.subtitle}}</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </app-layout>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentTime = new Date();
  
  metrics: MetricCard[] = [
    {
      title: "Total Usuarios",
      value: "1,234",
      description: "Usuarios registrados",
      icon: "people",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Veterinarios",
      value: "89",
      description: "Profesionales activos",
      icon: "medical_services",
      color: "text-primary-light",
      bgColor: "bg-primary-light/10"
    },
    {
      title: "Equinos",
      value: "2,567",
      description: "Equinos registrados",
      icon: "pets",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      title: "Libretas Sanitarias",
      value: "1,890",
      description: "Documentos activos",
      icon: "description",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Con Biometría",
      value: "1,456",
      description: "Equinos enrolados",
      icon: "fingerprint",
      color: "text-primary-light",
      bgColor: "bg-primary-light/10"
    },
    {
      title: "Establecimientos",
      value: "345",
      description: "Establecimientos activos",
      icon: "business",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    }
  ];

  recentActivities = [
    { action: "Nuevo usuario registrado", user: "María González", time: "Hace 2 min" },
    { action: "Libreta sanitaria aprobada", user: "Dr. López", time: "Hace 15 min" },
    { action: "Equino transferido", user: "Juan Pérez", time: "Hace 1 hora" },
    { action: "Establecimiento actualizado", user: "Ana Martín", time: "Hace 2 horas" }
  ];

  shortcuts = [
    { title: "Nuevo Usuario", subtitle: "Registrar usuario", color: "bg-gradient-to-br from-primary to-primary-light" },
    { title: "Nuevo Equino", subtitle: "Registrar equino", color: "bg-gradient-to-br from-primary-light to-secondary" },
    { title: "Ver Traslados", subtitle: "Consultar movimientos", color: "bg-gradient-to-br from-primary to-secondary" }
  ];

  ngOnInit() {
    // Update time every minute
    setInterval(() => {
      this.currentTime = new Date();
    }, 60000);
  }
}