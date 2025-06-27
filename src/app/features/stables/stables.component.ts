import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { StableService } from '../../core/services/stable.service';
import { StableInfoDTO, AddStableDTO, StableTypeDTO } from '../../core/models/stable.model';

@Component({
  selector: 'app-stable-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{isEdit ? 'Editar Establecimiento' : 'Nuevo Establecimiento'}}</h2>
    <mat-dialog-content class="max-h-96 overflow-y-auto">
      <form [formGroup]="stableForm" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <mat-form-field appearance="outline">
            <mat-label>Nombre *</mat-label>
            <input matInput formControlName="name" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Alias</mat-label>
            <input matInput formControlName="alias">
          </mat-form-field>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <mat-form-field appearance="outline">
            <mat-label>Teléfono</mat-label>
            <input matInput formControlName="phoneNumber">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>RENSPA</mat-label>
            <input matInput formControlName="renspa">
          </mat-form-field>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <mat-form-field appearance="outline">
            <mat-label>Tipo</mat-label>
            <mat-select formControlName="typeId">
              <mat-option *ngFor="let type of stableTypes" [value]="type.id">
                {{type.label}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Identificación</mat-label>
            <input matInput formControlName="identification">
          </mat-form-field>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <mat-form-field appearance="outline">
            <mat-label>País</mat-label>
            <input matInput formControlName="country">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Provincia</mat-label>
            <input matInput formControlName="province">
          </mat-form-field>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <mat-form-field appearance="outline">
            <mat-label>Ciudad</mat-label>
            <input matInput formControlName="city">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Dirección</mat-label>
          <textarea matInput formControlName="address" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button 
              color="primary" 
              [disabled]="stableForm.invalid || loading"
              (click)="onSave()">
        {{loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}}
      </button>
    </mat-dialog-actions>
  `
})
export class StableFormDialogComponent implements OnInit {
  stableForm: FormGroup;
  isEdit = false;
  loading = false;
  stable?: StableInfoDTO;
  stableTypes: StableTypeDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private stableService: StableService,
    private snackBar: MatSnackBar
  ) {
    this.stableForm = this.fb.group({
      name: ['', Validators.required],
      alias: [''],
      phoneNumber: [''],
      renspa: [''],
      typeId: [''],
      identification: [''],
      country: [''],
      province: [''],
      city: [''],
      address: ['']
    });
  }

  ngOnInit() {
    this.loadStableTypes();
  }

  loadStableTypes() {
    this.stableService.getStableTypes().subscribe({
      next: (types) => {
        this.stableTypes = types;
      }
    });
  }

  onSave() {
    if (this.stableForm.valid) {
      this.loading = true;
      const stableData = this.stableForm.value;
      
      const operation = this.isEdit && this.stable
        ? this.stableService.updateStable(this.stable.id, stableData)
        : this.stableService.createStable(stableData);

      operation.subscribe({
        next: () => {
          this.snackBar.open(
            this.isEdit ? 'Establecimiento actualizado correctamente' : 'Establecimiento creado correctamente',
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
  selector: 'app-stables',
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
    MatExpansionModule,
    LayoutComponent,
    PaginationComponent
  ],
  template: `
    <app-layout>
      <div class="space-y-6">
        <mat-card>
          <mat-card-header>
            <mat-card-title class="flex items-center justify-between w-full">
              <div class="flex items-center gap-2">
                <mat-icon>business</mat-icon>
                Gestión de Establecimientos
              </div>
              <button mat-raised-button color="primary" (click)="openStableDialog()">
                <mat-icon>add</mat-icon>
                Nuevo Establecimiento
              </button>
            </mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <div class="flex items-center space-x-2 mb-4">
              <mat-form-field appearance="outline" class="flex-1">
                <mat-label>Buscar por nombre, alias o RENSPA</mat-label>
                <input matInput 
                       placeholder="Buscar establecimientos..."
                       [(ngModel)]="searchTerm"
                       (input)="onSearch()">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
            </div>

            <div *ngIf="loading" class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
              <p class="ml-4">Cargando establecimientos...</p>
            </div>

            <table mat-table [dataSource]="filteredStables" class="w-full" *ngIf="!loading">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let stable">{{stable.name}}</td>
              </ng-container>

              <ng-container matColumnDef="alias">
                <th mat-header-cell *matHeaderCellDef>Alias</th>
                <td mat-cell *matCellDef="let stable">{{stable.alias}}</td>
              </ng-container>

              <ng-container matColumnDef="renspa">
                <th mat-header-cell *matHeaderCellDef>RENSPA</th>
                <td mat-cell *matCellDef="let stable">{{stable.renspa}}</td>
              </ng-container>

              <ng-container matColumnDef="type">
                <th mat-header-cell *matHeaderCellDef>Tipo</th>
                <td mat-cell *matCellDef="let stable">
                  <span *ngIf="stable.type" class="badge badge-info">
                    {{stable.type.name === 'SPORT' ? 'Deportivo' : 'Reproductivo'}}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="location">
                <th mat-header-cell *matHeaderCellDef>Ubicación</th>
                <td mat-cell *matCellDef="let stable">
                  {{stable.city}}, {{stable.province}}
                </td>
              </ng-container>

              <ng-container matColumnDef="owner">
                <th mat-header-cell *matHeaderCellDef>Owner</th>
                <td mat-cell *matCellDef="let stable">
                  {{stable.owner ? stable.owner.name + ' ' + stable.owner.lastName : 'Sin owner'}}
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let stable">
                  <div class="flex items-center space-x-2">
                    <button mat-icon-button (click)="toggleExpansion(stable.id)">
                      <mat-icon>{{expandedRows.has(stable.id) ? 'expand_less' : 'expand_more'}}</mat-icon>
                    </button>
                    <button mat-icon-button (click)="editStable(stable)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button (click)="deleteStable(stable)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="expandedDetail">
                <td mat-cell *matCellDef="let stable" [attr.colspan]="displayedColumns.length">
                  <div *ngIf="expandedRows.has(stable.id)" class="p-4 bg-gray-50 rounded-lg">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <h4 class="font-semibold mb-2">Información de Contacto</h4>
                        <p><strong>Teléfono:</strong> {{stable.phoneNumber || 'No especificado'}}</p>
                        <p><strong>Identificación:</strong> {{stable.identification || 'No especificado'}}</p>
                        <p><strong>Dirección:</strong> {{stable.address}}, {{stable.city}}, {{stable.province}}, {{stable.country}}</p>
                      </div>
                      <div>
                        <h4 class="font-semibold mb-2">Detalles</h4>
                        <p><strong>Owner:</strong> {{stable.owner ? stable.owner.name + ' ' + stable.owner.lastName : 'Sin owner'}}</p>
                        <p><strong>Email Owner:</strong> {{stable.owner?.email || 'No especificado'}}</p>
                        <p><strong>Estado:</strong> {{stable.deleted ? 'Eliminado' : 'Activo'}}</p>
                      </div>
                    </div>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                  [class.expanded-row]="expandedRows.has(row.id)"></tr>
              <tr mat-row *matRowDef="let row; columns: ['expandedDetail']; when: isExpansionDetailRow"
                  class="detail-row"></tr>
            </table>

            <div *ngIf="!loading && filteredStables.length === 0" class="text-center py-8">
              <mat-icon class="text-gray-400 text-4xl">business</mat-icon>
              <p class="text-gray-500 mt-2">No se encontraron establecimientos</p>
            </div>

            <app-pagination
              [currentPage]="currentPage"
              [totalPages]="totalPages"
              [totalElements]="totalElements"
              [pageSize]="pageSize"
              [numberOfElements]="stables.length"
              (pageChange)="onPageChange($event)"
              (pageSizeChange)="onPageSizeChange($event)">
            </app-pagination>
          </mat-card-content>
        </mat-card>
      </div>
    </app-layout>
  `,
  styleUrls: ['./stables.component.scss']
})
export class StablesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'alias', 'renspa', 'type', 'location', 'owner', 'actions'];
  
  stables: StableInfoDTO[] = [];
  filteredStables: StableInfoDTO[] = [];
  loading = false;
  searchTerm = '';
  expandedRows = new Set<number>();
  
  // Pagination
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 10;

  constructor(
    private stableService: StableService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadStables();
  }

  loadStables() {
    this.loading = true;
    this.stableService.getStables(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.stables = response.content;
        this.filteredStables = [...this.stables];
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      this.filteredStables = this.stables.filter(stable =>
        stable.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        stable.alias.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        stable.renspa.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredStables = [...this.stables];
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadStables();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadStables();
  }

  toggleExpansion(stableId: number) {
    if (this.expandedRows.has(stableId)) {
      this.expandedRows.delete(stableId);
    } else {
      this.expandedRows.add(stableId);
    }
  }

  isExpansionDetailRow = (i: number, row: Object) => {
    return this.expandedRows.has((row as any).id);
  }

  openStableDialog(stable?: StableInfoDTO) {
    const dialogRef = this.dialog.open(StableFormDialogComponent, {
      width: '800px',
      data: stable
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStables();
      }
    });
  }

  editStable(stable: StableInfoDTO) {
    this.openStableDialog(stable);
  }

  deleteStable(stable: StableInfoDTO) {
    if (confirm(`¿Estás seguro de que deseas eliminar el establecimiento "${stable.name}"?`)) {
      this.stableService.deleteStable(stable.id).subscribe({
        next: () => {
          this.snackBar.open('Establecimiento eliminado correctamente', 'Cerrar', { duration: 3000 });
          this.loadStables();
        }
      });
    }
  }
}