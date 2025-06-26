import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../shared/components/layout/layout.component';

@Component({
  selector: 'app-health-books',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="space-y-6">
        <h1 class="text-3xl font-bold text-gray-900">Libretas Sanitarias</h1>
        <p>Módulo de libretas sanitarias en desarrollo...</p>
      </div>
    </app-layout>
  `
})
export class HealthBooksComponent {}