import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { HealthBookMinInfo, HealthBookInfo } from '../models/health-book.model';
import { PaginatedResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class HealthBookService {
  constructor(private httpClient: HttpClientService) {}

  getHealthBooks(page: number = 0, size: number = 10): Observable<PaginatedResponse<HealthBookMinInfo>> {
    return this.httpClient.get<PaginatedResponse<HealthBookMinInfo>>('/equusid/health-book/list', {
      page: page.toString(),
      size: size.toString()
    });
  }

  getHealthBook(healthBookId: number): Observable<HealthBookInfo> {
    return this.httpClient.get<HealthBookInfo>(`/equusid/health-book/get/${healthBookId}`);
  }
}