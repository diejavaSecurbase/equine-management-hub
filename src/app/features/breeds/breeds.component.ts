import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { BreedService } from '../../core/services/breed.service';
import { BreedBiotypeInfo } from '../../core/models/breed.model';

@Component({
  selector: 'app-breed-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{isEdit ? 'Editar Raza' : 'Nueva Raza'}}</h2>
    <mat-dialog-content>
      <form [formGroup]="breedForm" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Nombre de la Raza</mat-label>
          <input matInput formControlName="name" required placeholder="Ingrese el nombre de la raza">
          <mat-error *ngIf="breedForm.get('name')?.hasError('required')">
            El nombre de la raza es requerido
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button 
              color="primary" 
              [disabled]="breedForm.invalid || loading"
              (click)="onSave()">
        {{loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}}
      </button>
    </mat-dialog-actions>
  `
})
export class BreedFormDialogComponent {
  breedForm: FormGroup;
  isEdit = false;
  loading = false;
  breed?: BreedBiotypeInfo;

  constructor(
    private fb: FormBuilder,
    private breedService: BreedService,
    private snackBar: MatSnackBar
  ) {
    this.breedForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSave() {
    if (this.breedForm.valid) {
      this.loading = true;
      const breedData = this.breedForm.value;
      
      const operation = this.isEdit && this.breed
        ? this.breedService.updateBreed(this.breed.id, breedData)
        : this.breedService.createBreed(breedData);

      operation.subscribe({
        next: () => {
          this.snackBar.open(
            this.isEdit ? 'Raza actualizada correctamente' : 'Raza creada correctamente',
            'Cerrar',
            { duration: 3000 }
          );
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }
}

@Component({
  selector: 'app-breeds',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    LayoutComponent
  ],
  template: `
    <app-layout>
      <div class="space-y-6">
        <mat-card>
          <mat-card-header>
            <mat-card-title class="flex items-center justify-between w-full">
              <span>Gestión de Razas</span>
              <button mat-raised-button color="primary" (click)="openBreedDialog()">
                <mat-icon>add</mat-icon>
                Nueva Raza
              </button>
            </mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <div class="flex items-center space-x-2 mb-4">
              <mat-form-field appearance="outline" class="flex-1">
                <mat-label>Buscar razas</mat-label>
                <input matInput 
                       placeholder="Buscar razas..."
                       [(ngModel)]="searchTerm"
                       (input)="onSearch()">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
            </div>

            <div *ngIf="loading" class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
              <p class="ml-4">Cargando razas...</p>
            </div>

            <table mat-table [dataSource]="filteredBreeds" class="w-full" *ngIf="!loading">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let breed">{{breed.id}}</td>
              </ng-container>

              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let breed">
                  <div class="flex items-center space-x-2">
                    <span>{{breed.name}}</span>
                    <span class="badge badge-info">Activa</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let breed">
                  <div class="flex items-center space-x-2">
                    <button mat-icon-button (click)="editBreed(breed)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button (click)="deleteBreed(breed)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div *ngIf="!loading && filteredBreeds.length === 0" class="text-center py-8">
              <mat-icon class="text-gray-400 text-4xl">category</mat-icon>
              <p class="text-gray-500 mt-2">No se encontraron razas</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </app-layout>
  `,
  styleUrls: ['./breeds.component.scss']
})
export class BreedsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  
  breeds: BreedBiotypeInfo[] = [];
  filteredBreeds: BreedBiotypeInfo[] = [];
  loading = false;
  searchTerm = '';

  constructor(
    private breedService: BreedService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadBreeds();
  }

  loadBreeds() {
    this.loading = true;
    this.breedService.getBreeds().subscribe({
      next: (breeds) => {
        this.breeds = breeds;
        this.filteredBreeds = [...this.breeds];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      this.filteredBreeds = this.breeds.filter(breed =>
        breed.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredBreeds = [...this.breeds];
    }
  }

  openBreedDialog(breed?: BreedBiotypeInfo) {
    const dialogRef = this.dialog.open(BreedFormDialogComponent, {
      width: '500px',
      data: breed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBreeds();
      }
    });
  }

  editBreed(breed: BreedBiotypeInfo) {
    this.openBreedDialog(breed);
  }

  deleteBreed(breed: BreedBiotypeInfo) {
    if (confirm(`¿Estás seguro de que deseas eliminar la raza "${breed.name}"?`)) {
      this.breedService.deleteBreed(breed.id).subscribe({
        next: () => {
          this.snackBar.open('Raza eliminada correctamente', 'Cerrar', { duration: 3000 });
          this.loadBreeds();
        }
      });
    }
  }
}