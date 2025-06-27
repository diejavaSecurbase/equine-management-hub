import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  template: `
    <div class="flex items-center justify-between mt-4">
      <div class="text-sm text-gray-600">
        Mostrando {{startItem}} - {{endItem}} de {{totalElements}} elementos
      </div>
      
      <div class="flex items-center space-x-4">
        <mat-form-field appearance="outline" class="w-20">
          <mat-label>Por página</mat-label>
          <mat-select [value]="pageSize" (selectionChange)="onPageSizeChange($event.value)">
            <mat-option [value]="5">5</mat-option>
            <mat-option [value]="10">10</mat-option>
            <mat-option [value]="25">25</mat-option>
            <mat-option [value]="50">50</mat-option>
          </mat-select>
        </mat-form-field>
        
        <div class="flex items-center space-x-2">
          <button mat-icon-button 
                  [disabled]="currentPage === 0"
                  (click)="onPageChange(0)">
            <mat-icon>first_page</mat-icon>
          </button>
          
          <button mat-icon-button 
                  [disabled]="currentPage === 0"
                  (click)="onPageChange(currentPage - 1)">
            <mat-icon>chevron_left</mat-icon>
          </button>
          
          <span class="text-sm px-4">
            Página {{currentPage + 1}} de {{totalPages}}
          </span>
          
          <button mat-icon-button 
                  [disabled]="currentPage === totalPages - 1"
                  (click)="onPageChange(currentPage + 1)">
            <mat-icon>chevron_right</mat-icon>
          </button>
          
          <button mat-icon-button 
                  [disabled]="currentPage === totalPages - 1"
                  (click)="onPageChange(totalPages - 1)">
            <mat-icon>last_page</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() currentPage = 0;
  @Input() totalPages = 0;
  @Input() totalElements = 0;
  @Input() pageSize = 10;
  @Input() numberOfElements = 0;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  get startItem(): number {
    return this.currentPage * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalElements);
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(size: number): void {
    this.pageSizeChange.emit(size);
  }
}