import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LayoutComponent } from '../../shared/components/layout/layout.component';

interface Equine {
  id: number;
  name: string;
  chip: string;
  breedBiotypeName: string;
  sex: string;
  ownerName: string;
  isIrisEnrolled: boolean;
  healthBookStatus: string;
  deleted: boolean;
}

@Component({
  selector: 'app-equines',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    LayoutComponent
  ],
  template: `
    <app-layout>
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Gestión de Equinos</h1>
            <p class="text-gray-600 mt-2">Administra la información de equinos registrados</p>
          </div>
          <button mat-raised-button color="primary">
            <mat-icon>add</mat-icon>
            Nuevo Equino
          </button>
        </div>

        <mat-card class="shadow-md border-0">
          <mat-card-header>
            <mat-card-title class="flex items-center justify-between w-full">
              <span>Lista de Equinos</span>
              <mat-form-field appearance="outline" class="max-w-sm">
                <mat-label>Buscar equinos</mat-label>
                <input matInput 
                       placeholder="Buscar equinos..."
                       [(ngModel)]="searchTerm"
                       (input)="onSearch()">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="filteredEquines" class="w-full">
              <ng-container matColumnDef="equine">
                <th mat-header-cell *matHeaderCellDef>Equino</th>
                <td mat-cell *matCellDef="let equine">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span class="text-sm">🐎</span>
                    </div>
                    <div>
                      <div class="font-medium">{{equine.name}}</div>
                    </div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="chip">
                <th mat-header-cell *matHeaderCellDef>Chip</th>
                <td mat-cell *matCellDef="let equine">
                  <span class="font-mono text-sm">{{equine.chip}}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="breed">
                <th mat-header-cell *matHeaderCellDef>Raza</th>
                <td mat-cell *matCellDef="let equine">{{equine.breedBiotypeName}}</td>
              </ng-container>

              <ng-container matColumnDef="sex">
                <th mat-header-cell *matHeaderCellDef>Sexo</th>
                <td mat-cell *matCellDef="let equine">{{equine.sex}}</td>
              </ng-container>

              <ng-container matColumnDef="owner">
                <th mat-header-cell *matHeaderCellDef>Propietario</th>
                <td mat-cell *matCellDef="let equine">{{equine.ownerName}}</td>
              </ng-container>

              <ng-container matColumnDef="biometry">
                <th mat-header-cell *matHeaderCellDef>Biometría</th>
                <td mat-cell *matCellDef="let equine">
                  <span [class]="equine.isIrisEnrolled ? 'badge badge-success' : 'badge badge-warning'">
                    {{equine.isIrisEnrolled ? 'Enrolado' : 'Sin enrolar'}}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="healthBook">
                <th mat-header-cell *matHeaderCellDef>Libreta Sanitaria</th>
                <td mat-cell *matCellDef="let equine">
                  <span [class]="getHealthBookBadgeClass(equine.healthBookStatus)">
                    {{getHealthBookLabel(equine.healthBookStatus)}}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let equine">
                  <div class="flex space-x-2">
                    <button mat-icon-button>
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button>
                      <mat-icon>person</mat-icon>
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
  styleUrls: ['./equines.component.scss']
})
export class EquinesComponent {
  displayedColumns: string[] = ['equine', 'chip', 'breed', 'sex', 'owner', 'biometry', 'healthBook', 'actions'];
  searchTerm = '';

  mockEquines: Equine[] = [
    {
      id: 1,
      name: 'Thunder',
      chip: 'CHI001234567',
      breedBiotypeName: 'Pura Sangre',
      sex: 'Macho',
      ownerName: 'Juan Pérez',
      isIrisEnrolled: true,
      healthBookStatus: 'APPROVED',
      deleted: false
    },
    {
      id: 2,
      name: 'Star',
      chip: 'CHI007654321',
      breedBiotypeName: 'Criollo',
      sex: 'Hembra',
      ownerName: 'María González',
      isIrisEnrolled: false,
      healthBookStatus: 'PENDING',
      deleted: false
    },
    {
      id: 3,
      name: 'Lightning',
      chip: 'CHI001111111',
      breedBiotypeName: 'Cuarto de Milla',
      sex: 'Macho',
      ownerName: 'Carlos López',
      isIrisEnrolled: true,
      healthBookStatus: 'APPROVED',
      deleted: false
    }
  ];

  filteredEquines = [...this.mockEquines];

  onSearch() {
    if (this.searchTerm.trim()) {
      this.filteredEquines = this.mockEquines.filter(equine =>
        equine.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        equine.chip.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        equine.ownerName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredEquines = [...this.mockEquines];
    }
  }

  getHealthBookBadgeClass(status: string): string {
    const classes = {
      'APPROVED': 'badge badge-success',
      'PENDING': 'badge badge-warning',
      'REJECTED': 'badge badge-error'
    };
    return classes[status as keyof typeof classes] || 'badge';
  }

  getHealthBookLabel(status: string): string {
    const labels = {
      'APPROVED': 'Aprobada',
      'PENDING': 'Pendiente',
      'REJECTED': 'Rechazada'
    };
    return labels[status as keyof typeof labels] || status;
  }
}