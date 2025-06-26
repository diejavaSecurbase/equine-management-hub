import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { LayoutComponent } from '../../shared/components/layout/layout.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    LayoutComponent
  ],
  template: `
    <app-layout>
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p class="text-gray-600 mt-2">Administra usuarios del sistema</p>
          </div>
        </div>

        <mat-card class="shadow-md border-0">
          <mat-card-header>
            <mat-card-title class="flex items-center justify-between w-full">
              <span>Lista de Usuarios</span>
              <mat-form-field appearance="outline" class="max-w-sm">
                <mat-label>Buscar usuarios</mat-label>
                <input matInput placeholder="Buscar usuarios...">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="users" class="w-full">
              <ng-container matColumnDef="user">
                <th mat-header-cell *matHeaderCellDef>Usuario</th>
                <td mat-cell *matCellDef="let user">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                      <mat-icon class="text-gray-600">person</mat-icon>
                    </div>
                    <div>
                      <div class="font-medium">{{user.name}} {{user.lastName}}</div>
                    </div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let user">{{user.email}}</td>
              </ng-container>

              <ng-container matColumnDef="identification">
                <th mat-header-cell *matHeaderCellDef>Identificación</th>
                <td mat-cell *matCellDef="let user">{{user.identification}}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip [class]="user.enrolled ? 'badge-success' : 'badge-error'">
                    {{user.enrolled ? 'Activo' : 'Inactivo'}}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let user">
                  <div class="flex space-x-2">
                    <button mat-icon-button>
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button>
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>
      </div>
    </app-layout>
  `,
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  displayedColumns: string[] = ['user', 'email', 'identification', 'status', 'actions'];
  
  users = [
    {
      id: 1,
      name: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@email.com',
      identification: '12345678',
      enrolled: true
    },
    {
      id: 2,
      name: 'María',
      lastName: 'González',
      email: 'maria.gonzalez@email.com',
      identification: '87654321',
      enrolled: false
    }
  ];
}