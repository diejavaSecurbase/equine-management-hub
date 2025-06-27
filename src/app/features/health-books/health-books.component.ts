import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { HealthBookService } from '../../core/services/health-book.service';
import { HealthBookMinInfo, HealthBookInfo } from '../../core/models/health-book.model';

@Component({
  selector: 'app-health-book-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTabsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Detalle de Libreta Sanitaria - {{healthBook?.senasaId || 'Cargando...'}}</h2>
    <mat-dialog-content class="max-h-96 overflow-y-auto">
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
        <p class="ml-4">Cargando detalle...</p>
      </div>

      <div *ngIf="!loading && healthBook" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Información General</h3>
            <div class="space-y-2">
              <p><strong>Equino:</strong> {{healthBook.equineMinInfo?.name}}</p>
              <p><strong>Estado:</strong> 
                <span [class]="getStateBadgeClass(healthBook.state)">
                  {{getStateLabel(healthBook.state)}}
                </span>
              </p>
              <p><strong>Identificación:</strong> {{healthBook.senasaId}}</p>
              <p><strong>Actualizado:</strong> {{healthBook.updatedAt | date:'short'}}</p>
            </div>
          </div>
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Veterinario Responsable</h3>
            <p *ngIf="healthBook.approvalVeterinarian; else noVet">
              {{healthBook.approvalVeterinarian.name}} {{healthBook.approvalVeterinarian.lastName}}
            </p>
            <ng-template #noVet>
              <p class="text-gray-500">Sin veterinario asignado</p>
            </ng-template>
          </div>
        </div>

        <mat-tab-group>
          <mat-tab label="Extracciones de Sangre">
            <div class="pt-4">
              <div *ngIf="healthBook.extractionInfoList?.length; else noExtractions">
                <table mat-table [dataSource]="healthBook.extractionInfoList" class="w-full">
                  <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef>Fecha</th>
                    <td mat-cell *matCellDef="let extraction">{{extraction.extractionDate | date}}</td>
                  </ng-container>

                  <ng-container matColumnDef="veterinarian">
                    <th mat-header-cell *matHeaderCellDef>Veterinario</th>
                    <td mat-cell *matCellDef="let extraction">
                      {{extraction.veterinarianName}} {{extraction.veterinarianLastName}}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="identification">
                    <th mat-header-cell *matHeaderCellDef>Identificación</th>
                    <td mat-cell *matCellDef="let extraction">{{extraction.veterinarianIdentification}}</td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="extractionColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: extractionColumns;"></tr>
                </table>
              </div>
              <ng-template #noExtractions>
                <p class="text-gray-500 text-center py-4">No hay extracciones registradas</p>
              </ng-template>
            </div>
          </mat-tab>

          <mat-tab label="Aplicaciones de Vacunas">
            <div class="pt-4">
              <div *ngIf="healthBook.vaccineApplicationInfoList?.length; else noVaccines">
                <table mat-table [dataSource]="healthBook.vaccineApplicationInfoList" class="w-full">
                  <ng-container matColumnDef="vaccine">
                    <th mat-header-cell *matHeaderCellDef>Vacuna</th>
                    <td mat-cell *matCellDef="let vaccine">
                      <div>
                        <p class="font-medium">{{vaccine.vaccineCommercialName}}</p>
                        <p class="text-sm text-gray-500">{{vaccine.vaccineManufacturer}}</p>
                      </div>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="applicationDate">
                    <th mat-header-cell *matHeaderCellDef>Fecha Aplicación</th>
                    <td mat-cell *matCellDef="let vaccine">{{vaccine.applicationDate | date}}</td>
                  </ng-container>

                  <ng-container matColumnDef="lot">
                    <th mat-header-cell *matHeaderCellDef>Lote</th>
                    <td mat-cell *matCellDef="let vaccine">{{vaccine.vaccineLotNumber}}</td>
                  </ng-container>

                  <ng-container matColumnDef="veterinarian">
                    <th mat-header-cell *matHeaderCellDef>Veterinario</th>
                    <td mat-cell *matCellDef="let vaccine">
                      {{vaccine.veterinarianName}} {{vaccine.veterinarianLastName}}
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="vaccineColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: vaccineColumns;"></tr>
                </table>
              </div>
              <ng-template #noVaccines>
                <p class="text-gray-500 text-center py-4">No hay vacunas registradas</p>
              </ng-template>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>

      <div *ngIf="!loading && !healthBook" class="text-center py-8">
        <p class="text-gray-500">No hay detalle disponible</p>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `
})
export class HealthBookDetailDialogComponent {
  healthBook?: HealthBookInfo;
  loading = false;
  extractionColumns = ['date', 'veterinarian', 'identification'];
  vaccineColumns = ['vaccine', 'applicationDate', 'lot', 'veterinarian'];

  constructor(private healthBookService: HealthBookService) {}

  loadHealthBookDetail(healthBookId: number) {
    this.loading = true;
    this.healthBookService.getHealthBook(healthBookId).subscribe({
      next: (healthBook) => {
        this.healthBook = healthBook;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getStateBadgeClass(state: string): string {
    const classes = {
      'APPROVED': 'badge badge-success',
      'PENDING': 'badge badge-warning',
      'REJECTED': 'badge badge-error'
    };
    return classes[state as keyof typeof classes] || 'badge';
  }

  getStateLabel(state: string): string {
    const labels = {
      'APPROVED': 'Aprobada',
      'PENDING': 'Pendiente',
      'REJECTED': 'Rechazada'
    };
    return labels[state as keyof typeof labels] || state;
  }
}

@Component({
  selector: 'app-health-books',
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
    LayoutComponent,
    PaginationComponent
  ],
  template: `
    <app-layout>
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Libretas Sanitarias</h1>
            <p class="text-gray-600 mt-2">Gestión de libretas sanitarias de equinos</p>
          </div>
        </div>

        <mat-card class="shadow-md border-0">
          <mat-card-header>
            <mat-card-title class="flex items-center justify-between w-full">
              <span>Lista de Libretas Sanitarias</span>
              <mat-form-field appearance="outline" class="max-w-sm">
                <mat-label>Buscar libretas</mat-label>
                <input matInput 
                       placeholder="Buscar libretas..."
                       [(ngModel)]="searchTerm"
                       (input)="onSearch()">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
            </mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <div *ngIf="loading" class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
              <p class="ml-4">Cargando libretas sanitarias...</p>
            </div>

            <table mat-table [dataSource]="filteredHealthBooks" class="w-full" *ngIf="!loading">
              <ng-container matColumnDef="senasaId">
                <th mat-header-cell *matHeaderCellDef>ID SENASA</th>
                <td mat-cell *matCellDef="let book">
                  <div class="flex items-center space-x-2">
                    <mat-icon class="text-blue-600">description</mat-icon>
                    <span class="font-medium">{{book.identification}}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="equine">
                <th mat-header-cell *matHeaderCellDef>Equino</th>
                <td mat-cell *matCellDef="let book">{{book.equineName}}</td>
              </ng-container>

              <ng-container matColumnDef="state">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let book">
                  <span [class]="getStateBadgeClass(book.state)">
                    {{getStateLabel(book.state)}}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="veterinarian">
                <th mat-header-cell *matHeaderCellDef>Veterinario</th>
                <td mat-cell *matCellDef="let book">
                  <span>-</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="lastUpdate">
                <th mat-header-cell *matHeaderCellDef>Última Actualización</th>
                <td mat-cell *matCellDef="let book">
                  {{book.updatedAt | date:'short'}}
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let book">
                  <div class="flex space-x-2">
                    <button mat-icon-button (click)="viewDetail(book)">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button disabled>
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button 
                            [disabled]="book.deleted"
                            (click)="showDeleteWarning()">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                  [class.opacity-50]="row.deleted"></tr>
            </table>

            <div *ngIf="!loading && filteredHealthBooks.length === 0" class="text-center py-8">
              <mat-icon class="text-gray-400 text-4xl">description</mat-icon>
              <p class="text-gray-500 mt-2">No se encontraron libretas sanitarias</p>
            </div>

            <app-pagination
              [currentPage]="currentPage"
              [totalPages]="totalPages"
              [totalElements]="totalElements"
              [pageSize]="pageSize"
              [numberOfElements]="healthBooks.length"
              (pageChange)="onPageChange($event)"
              (pageSizeChange)="onPageSizeChange($event)">
            </app-pagination>
          </mat-card-content>
        </mat-card>
      </div>
    </app-layout>
  `,
  styleUrls: ['./health-books.component.scss']
})
export class HealthBooksComponent implements OnInit {
  displayedColumns: string[] = ['senasaId', 'equine', 'state', 'veterinarian', 'lastUpdate', 'actions'];
  
  healthBooks: HealthBookMinInfo[] = [];
  filteredHealthBooks: HealthBookMinInfo[] = [];
  loading = false;
  searchTerm = '';
  
  // Pagination
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 10;

  constructor(
    private healthBookService: HealthBookService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadHealthBooks();
  }

  loadHealthBooks() {
    this.loading = true;
    this.healthBookService.getHealthBooks(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.healthBooks = response.content;
        this.filteredHealthBooks = [...this.healthBooks];
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
      this.filteredHealthBooks = this.healthBooks.filter(book =>
        book.equineName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (book.identification || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (book.state || '').toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredHealthBooks = [...this.healthBooks];
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadHealthBooks();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadHealthBooks();
  }

  getStateBadgeClass(state: string): string {
    const classes = {
      'APPROVED': 'badge badge-success',
      'PENDING': 'badge badge-warning',
      'REJECTED': 'badge badge-error'
    };
    return classes[state as keyof typeof classes] || 'badge';
  }

  getStateLabel(state: string): string {
    const labels = {
      'APPROVED': 'Aprobada',
      'PENDING': 'Pendiente',
      'REJECTED': 'Rechazada'
    };
    return labels[state as keyof typeof labels] || state;
  }

  viewDetail(healthBook: HealthBookMinInfo) {
    const dialogRef = this.dialog.open(HealthBookDetailDialogComponent, {
      width: '900px',
      maxHeight: '80vh'
    });

    dialogRef.componentInstance.loadHealthBookDetail(healthBook.id);
  }

  showDeleteWarning() {
    alert('La baja de la libreta sanitaria se realiza eliminando el equino asociado.');
  }
}