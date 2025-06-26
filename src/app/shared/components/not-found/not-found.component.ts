import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="text-center">
        <mat-icon class="text-6xl text-gray-400 mb-4">error_outline</mat-icon>
        <h1 class="text-4xl font-bold mb-4 text-gray-800">404</h1>
        <p class="text-xl text-gray-600 mb-6">Oops! Página no encontrada</p>
        <button mat-raised-button color="primary" routerLink="/dashboard">
          <mat-icon>home</mat-icon>
          Volver al Dashboard
        </button>
      </div>
    </div>
  `
})
export class NotFoundComponent {}