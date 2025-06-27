import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { UserService } from '../../core/services/user.service';
import { UserInfoDTO } from '../../core/models/user.model';

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>{{isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}}</h2>
    <mat-dialog-content>
      <form [formGroup]="userForm" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <mat-form-field appearance="outline">
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="name" required>
            <mat-error *ngIf="userForm.get('name')?.hasError('required')">
              El nombre es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Apellido</mat-label>
            <input matInput formControlName="lastName" required>
            <mat-error *ngIf="userForm.get('lastName')?.hasError('required')">
              El apellido es requerido
            </mat-error>
          </mat-form-field>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" required>
            <mat-error *ngIf="userForm.get('email')?.hasError('required')">
              El email es requerido
            </mat-error>
            <mat-error *ngIf="userForm.get('email')?.hasError('email')">
              Ingresa un email válido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Identificación</mat-label>
            <input matInput formControlName="identification" required>
          </mat-form-field>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <mat-form-field appearance="outline">
            <mat-label>Teléfono</mat-label>
            <input matInput formControlName="phoneNumber">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>País</mat-label>
            <input matInput formControlName="country">
          </mat-form-field>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <mat-form-field appearance="outline">
            <mat-label>Provincia</mat-label>
            <input matInput formControlName="province">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Ciudad</mat-label>
            <input matInput formControlName="city">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Dirección</mat-label>
          <textarea matInput formControlName="address" rows="3"></textarea>
        </mat-form-field>

        <div class="flex items-center">
          <mat-checkbox formControlName="acceptNotifications">
            Acepta notificaciones
          </mat-checkbox>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button 
              color="primary" 
              [disabled]="userForm.invalid || loading"
              (click)="onSave()">
        {{loading ? 'Guardando...' : 'Guardar'}}
      </button>
    </mat-dialog-actions>
  `
})
export class UserFormDialogComponent {
  userForm: FormGroup;
  isEdit = false;
  loading = false;
  user?: UserInfoDTO;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      identification: ['', Validators.required],
      phoneNumber: [''],
      country: [''],
      province: [''],
      city: [''],
      address: [''],
      acceptNotifications: [false]
    });
  }

  onSave() {
    if (this.userForm.valid) {
      this.loading = true;
      const userData = this.userForm.value;
      
      if (this.isEdit && this.user) {
        this.userService.updateAccountInfo(userData).subscribe({
          next: () => {
            this.snackBar.open('Usuario actualizado correctamente', 'Cerrar', { duration: 3000 });
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
      }
    }
  }
}

@Component({
  selector: 'app-users',
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
    MatChipsModule,
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
            <h1 class="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p class="text-gray-600 mt-2">Administra usuarios del sistema</p>
          </div>
          <button mat-raised-button color="primary" (click)="openUserDialog()">
            <mat-icon>add</mat-icon>
            Nuevo Usuario
          </button>
        </div>

        <mat-card class="shadow-md border-0">
          <mat-card-header>
            <mat-card-title class="flex items-center justify-between w-full">
              <span>Lista de Usuarios</span>
              <mat-form-field appearance="outline" class="max-w-sm">
                <mat-label>Buscar usuarios</mat-label>
                <input matInput 
                       placeholder="Buscar usuarios..."
                       [(ngModel)]="searchTerm"
                       (input)="onSearch()">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
            </mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <div *ngIf="loading" class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
              <p class="ml-4">Cargando usuarios...</p>
            </div>

            <table mat-table [dataSource]="filteredUsers" class="w-full" *ngIf="!loading">
              <ng-container matColumnDef="user">
                <th mat-header-cell *matHeaderCellDef>Usuario</th>
                <td mat-cell *matCellDef="let user">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                      <img *ngIf="user.profilePicture" 
                           [src]="'data:image/jpeg;base64,' + user.profilePicture"
                           [alt]="'Foto de ' + user.name + ' ' + user.lastName"
                           class="w-full h-full object-cover">
                      <mat-icon *ngIf="!user.profilePicture" class="text-gray-600">person</mat-icon>
                    </div>
                    <div>
                      <div class="font-medium">{{user.name}} {{user.lastName}}</div>
                      <div class="text-sm text-gray-500">{{user.profile}}</div>
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

              <ng-container matColumnDef="address">
                <th mat-header-cell *matHeaderCellDef>Dirección</th>
                <td mat-cell *matCellDef="let user">{{user.address || '-'}}</td>
              </ng-container>

              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef>Teléfono</th>
                <td mat-cell *matCellDef="let user">{{user.phoneNumber || '-'}}</td>
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
                    <button mat-icon-button (click)="editUser(user)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button (click)="deleteUser(user.id)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div *ngIf="!loading && filteredUsers.length === 0" class="text-center py-8">
              <mat-icon class="text-gray-400 text-4xl">people_outline</mat-icon>
              <p class="text-gray-500 mt-2">No se encontraron usuarios</p>
            </div>

            <app-pagination
              [currentPage]="currentPage"
              [totalPages]="totalPages"
              [totalElements]="totalElements"
              [pageSize]="pageSize"
              [numberOfElements]="users.length"
              (pageChange)="onPageChange($event)"
              (pageSizeChange)="onPageSizeChange($event)">
            </app-pagination>
          </mat-card-content>
        </mat-card>
      </div>
    </app-layout>
  `,
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['user', 'email', 'identification', 'address', 'phone', 'status', 'actions'];
  
  users: UserInfoDTO[] = [];
  filteredUsers: UserInfoDTO[] = [];
  loading = false;
  searchTerm = '';
  
  // Pagination
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 10;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.users = response.content;
        this.filteredUsers = [...this.users];
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
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredUsers = [...this.users];
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadUsers();
  }

  openUserDialog(user?: UserInfoDTO) {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '800px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  editUser(user: UserInfoDTO) {
    this.openUserDialog(user);
  }

  deleteUser(userId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', { duration: 3000 });
          this.loadUsers();
        }
      });
    }
  }
}