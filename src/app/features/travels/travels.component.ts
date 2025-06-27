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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { TravelService } from '../../core/services/travel.service';
import { TravelInfo, AddTravelDTO, TravelFilters } from '../../core/models/travel.model';
import { UserInfoDTO } from '../../core/models/user.model';
import { EquineMinInfo } from '../../core/models/health-book.model';

@Component({
  selector: 'app-travel-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>Nuevo Traslado</h2>
    <mat-dialog-content class="max-h-96 overflow-y-auto">
      <form [formGroup]="travelForm" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Referencia</mat-label>
          <input matInput formControlName="reference" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Propietario</mat-label>
          <mat-select formControlName="ownerId" (selectionChange)="onOwnerChange($event.value)">
            <mat-option *ngFor="let owner of owners" [value]="owner.id">
              {{owner.name}} {{owner.lastName}} ({{owner.identification}})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Equinos</mat-label>
          <mat-select formControlName="equineIds" multiple [disabled]="!selectedOwner">
            <mat-option *ngFor="let equine of equines" [value]="equine.id">
              {{equine.name}} ({{equine.chip}})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div class="space-y-2">
          <h4 class="font-semibold">Origen</h4>
          <div class="grid grid-cols-2 gap-4">
            <mat-form-field appearance="outline">
              <mat-label>País</mat-label>
              <input matInput formControlName="originCountry">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Provincia</mat-label>
              <input matInput formControlName="originProvince">
            </mat-form-field>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <mat-form-field appearance="outline">
              <mat-label>Ciudad</mat-label>
              <input matInput formControlName="originCity">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Alias</mat-label>
              <input matInput formControlName="originAlias">
            </mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Dirección</mat-label>
            <textarea matInput formControlName="originAddress" rows="2"></textarea>
          </mat-form-field>
        </div>

        <div class="space-y-2">
          <h4 class="font-semibold">Destino</h4>
          <div class="grid grid-cols-2 gap-4">
            <mat-form-field appearance="outline">
              <mat-label>País</mat-label>
              <input matInput formControlName="destinationCountry">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Provincia</mat-label>
              <input matInput formControlName="destinationProvince">
            </mat-form-field>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <mat-form-field appearance="outline">
              <mat-label>Ciudad</mat-label>
              <input matInput formControlName="destinationCity">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Alias</mat-label>
              <input matInput formControlName="destinationAlias">
            </mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Dirección</mat-label>
            <textarea matInput formControlName="destinationAddress" rows="2"></textarea>
          </mat-form-field>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <mat-form-field appearance="outline">
            <mat-label>Fecha y hora de inicio</mat-label>
            <input matInput type="datetime-local" formControlName="startAt">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Fecha y hora de fin (opcional)</mat-label>
            <input matInput type="datetime-local" formControlName="endsAt">
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button 
              color="primary" 
              [disabled]="travelForm.invalid || loading"
              (click)="onSave()">
        {{loading ? 'Guardando...' : 'Guardar'}}
      </button>
    </mat-dialog-actions>
  `
})
export class TravelFormDialogComponent implements OnInit {
  travelForm: FormGroup;
  loading = false;
  owners: UserInfoDTO[] = [];
  equines: EquineMinInfo[] = [];
  selectedOwner?: number;

  constructor(
    private fb: FormBuilder,
    private travelService: TravelService,
    private snackBar: MatSnackBar
  ) {
    this.travelForm = this.fb.group({
      reference: ['', Validators.required],
      ownerId: ['', Validators.required],
      equineIds: [[], Validators.required],
      originCountry: [''],
      originProvince: [''],
      originCity: [''],
      originAlias: [''],
      originAddress: [''],
      destinationCountry: [''],
      destinationProvince: [''],
      destinationCity: [''],
      destinationAlias: [''],
      destinationAddress: [''],
      startAt: ['', Validators.required],
      endsAt: ['']
    });
  }

  ngOnInit() {
    this.loadOwners();
  }

  loadOwners() {
    this.travelService.getOwners().subscribe({
      next: (response) => {
        // Filter only owners
        this.owners = response.content?.filter((u: UserInfoDTO) => u.profile === 'PROPIETARIO') || [];
      }
    });
  }

  onOwnerChange(ownerId: number) {
    this.selectedOwner = ownerId;
    if (ownerId) {
      this.travelService.getEquinesByOwner(ownerId).subscribe({
        next: (equines) => {
          this.equines = equines;
        }
      });
    } else {
      this.equines = [];
    }
    this.travelForm.patchValue({ equineIds: [] });
  }

  onSave() {
    if (this.travelForm.valid) {
      this.loading = true;
      const formValue = this.travelForm.value;
      
      const travelData: AddTravelDTO = {
        reference: formValue.reference,
        origin: {
          alias: formValue.originAlias,
          country: formValue.originCountry,
          province: formValue.originProvince,
          city: formValue.originCity,
          address: formValue.originAddress
        },
        destination: {
          alias: formValue.destinationAlias,
          country: formValue.destinationCountry,
          province: formValue.destinationProvince,
          city: formValue.destinationCity,
          address: formValue.destinationAddress
        },
        startAt: formValue.startAt,
        endsAt: formValue.endsAt,
        creatorId: formValue.ownerId,
        equineIds: formValue.equineIds
      };

      this.travelService.addTravel(travelData).subscribe({
        next: () => {
          this.snackBar.open('Traslado creado correctamente', 'Cerrar', { duration: 3000 });
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
  selector: 'app-travels',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LayoutComponent,
    PaginationComponent
  ],
  template: `
    <app-layout>
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Consulta de Traslados</h1>
            <p class="text-gray-600 mt-2">Consulta y seguimiento de traslados de equinos</p>
          </div>
          <button mat-raised-button color="primary" (click)="openTravelDialog()">
            <mat-icon>add</mat-icon>
            Nuevo Traslado
          </button>
        </div>

        <!-- Filtros -->
        <mat-card class="shadow-md border-0">
          <mat-card-header>
            <mat-card-title class="flex items-center">
              <mat-icon class="mr-2">filter_list</mat-icon>
              Filtros de Búsqueda
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="filtersForm" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <mat-form-field appearance="outline">
                <mat-label>Búsqueda General</mat-label>
                <input matInput formControlName="searchTerm" placeholder="Referencia, establecimiento...">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Estado</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="">Todos los estados</mat-option>
                  <mat-option value="PENDING">Pendiente</mat-option>
                  <mat-option value="CONFIRMED">Confirmado</mat-option>
                  <mat-option value="IN_PROGRESS">En Progreso</mat-option>
                  <mat-option value="DONE">Completado</mat-option>
                  <mat-option value="CANCELED">Cancelado</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Fecha Desde</mat-label>
                <input matInput type="date" formControlName="dateFrom">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Fecha Hasta</mat-label>
                <input matInput type="date" formControlName="dateTo">
              </mat-form-field>

              <div class="flex items-end">
                <button mat-stroked-button type="button" (click)="clearFilters()">
                  Limpiar Filtros
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Resultados -->
        <mat-card class="shadow-md border-0">
          <mat-card-header>
            <mat-card-title>
              Resultados de Traslados ({{totalElements}})
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="loading" class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
              <p class="ml-4">Cargando traslados...</p>
            </div>

            <table mat-table [dataSource]="travels" class="w-full" *ngIf="!loading">
              <ng-container matColumnDef="reference">
                <th mat-header-cell *matHeaderCellDef>Referencia</th>
                <td mat-cell *matCellDef="let travel">
                  <div class="flex items-center space-x-2">
                    <mat-icon class="text-blue-600">local_shipping</mat-icon>
                    <span class="font-medium">{{travel.reference}}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="equines">
                <th mat-header-cell *matHeaderCellDef>Equinos</th>
                <td mat-cell *matCellDef="let travel">
                  <div class="space-y-1">
                    <div *ngFor="let equine of travel.equines" class="flex items-center space-x-2">
                      <mat-icon class="text-gray-500 text-sm">pets</mat-icon>
                      <span class="text-sm">{{equine.name}}</span>
                    </div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="origin">
                <th mat-header-cell *matHeaderCellDef>Origen</th>
                <td mat-cell *matCellDef="let travel">
                  <div class="flex items-start space-x-2">
                    <mat-icon class="text-green-600 mt-1">place</mat-icon>
                    <div>
                      <div class="font-medium">{{travel.origin.stableName || travel.origin.alias}}</div>
                      <div class="text-sm text-gray-500">{{travel.origin.city}}, {{travel.origin.province}}</div>
                      <div *ngIf="travel.origin.stableRenspa" class="text-xs text-gray-400">{{travel.origin.stableRenspa}}</div>
                    </div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="destination">
                <th mat-header-cell *matHeaderCellDef>Destino</th>
                <td mat-cell *matCellDef="let travel">
                  <div class="flex items-start space-x-2">
                    <mat-icon class="text-red-600 mt-1">place</mat-icon>
                    <div>
                      <div class="font-medium">{{travel.destination.stableName || travel.destination.alias}}</div>
                      <div class="text-sm text-gray-500">{{travel.destination.city}}, {{travel.destination.province}}</div>
                      <div *ngIf="travel.destination.stableRenspa" class="text-xs text-gray-400">{{travel.destination.stableRenspa}}</div>
                      <div *ngIf="travel.destination.eventName" class="text-xs text-blue-600">{{travel.destination.eventName}}</div>
                    </div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="dates">
                <th mat-header-cell *matHeaderCellDef>Fechas</th>
                <td mat-cell *matCellDef="let travel">
                  <div class="flex items-start space-x-2">
                    <mat-icon class="text-blue-600 mt-1">schedule</mat-icon>
                    <div>
                      <div class="text-sm">
                        <strong>Inicio:</strong> {{travel.startAt | date:'short'}}
                      </div>
                      <div class="text-sm">
                        <strong>Fin:</strong> {{travel.endsAt | date:'short'}}
                      </div>
                    </div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let travel">
                  <span [class]="getStatusBadgeClass(travel.travelStatus)">
                    {{getStatusLabel(travel.travelStatus)}}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="creator">
                <th mat-header-cell *matHeaderCellDef>Creador</th>
                <td mat-cell *matCellDef="let travel">
                  <div>
                    <div class="font-medium text-sm">{{travel.creator.name}} {{travel.creator.lastName}}</div>
                    <div class="text-xs text-gray-500">{{travel.creator.profile}}</div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let travel">
                  <button mat-icon-button (click)="deleteTravel(travel)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div *ngIf="!loading && travels.length === 0" class="text-center py-8">
              <mat-icon class="text-gray-400 text-4xl">local_shipping</mat-icon>
              <p class="text-gray-500 mt-2">No se encontraron traslados con los filtros aplicados</p>
            </div>

            <app-pagination
              [currentPage]="currentPage"
              [totalPages]="totalPages"
              [totalElements]="totalElements"
              [pageSize]="pageSize"
              [numberOfElements]="travels.length"
              (pageChange)="onPageChange($event)"
              (pageSizeChange)="onPageSizeChange($event)">
            </app-pagination>
          </mat-card-content>
        </mat-card>
      </div>
    </app-layout>
  `,
  styleUrls: ['./travels.component.scss']
})
export class TravelsComponent implements OnInit {
  displayedColumns: string[] = ['reference', 'equines', 'origin', 'destination', 'dates', 'status', 'creator', 'actions'];
  
  travels: TravelInfo[] = [];
  loading = false;
  filtersForm: FormGroup;
  
  // Pagination
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 10;

  constructor(
    private fb: FormBuilder,
    private travelService: TravelService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.filtersForm = this.fb.group({
      searchTerm: [''],
      status: [''],
      dateFrom: [''],
      dateTo: ['']
    });
  }

  ngOnInit() {
    this.loadTravels();
    
    // Subscribe to filter changes
    this.filtersForm.valueChanges.subscribe(() => {
      this.currentPage = 0;
      this.loadTravels();
    });
  }

  loadTravels() {
    this.loading = true;
    const filters: TravelFilters = this.filtersForm.value;
    
    this.travelService.getTravels(this.currentPage, this.pageSize, filters).subscribe({
      next: (response) => {
        this.travels = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadTravels();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadTravels();
  }

  clearFilters() {
    this.filtersForm.reset();
  }

  getStatusBadgeClass(status: string): string {
    const classes = {
      'PENDING': 'badge badge-warning',
      'CONFIRMED': 'badge badge-info',
      'IN_PROGRESS': 'badge badge-warning',
      'DONE': 'badge badge-success',
      'CANCELED': 'badge badge-error'
    };
    return classes[status as keyof typeof classes] || 'badge';
  }

  getStatusLabel(status: string): string {
    const labels = {
      'PENDING': 'Pendiente',
      'CONFIRMED': 'Confirmado',
      'IN_PROGRESS': 'En Progreso',
      'DONE': 'Completado',
      'CANCELED': 'Cancelado'
    };
    return labels[status as keyof typeof labels] || status;
  }

  openTravelDialog() {
    const dialogRef = this.dialog.open(TravelFormDialogComponent, {
      width: '800px',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTravels();
      }
    });
  }

  deleteTravel(travel: TravelInfo) {
    if (confirm(`¿Estás seguro de que deseas eliminar el traslado "${travel.reference}"?`)) {
      this.travelService.deleteTravel(travel.id).subscribe({
        next: () => {
          this.snackBar.open('Traslado eliminado correctamente', 'Cerrar', { duration: 3000 });
          this.loadTravels();
        }
      });
    }
  }
}