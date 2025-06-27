import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { TravelInfo, AddTravelDTO, TravelFilters } from '../models/travel.model';
import { PaginatedResponse, UserInfoDTO } from '../models/user.model';
import { EquineMinInfo } from '../models/health-book.model';

@Injectable({
  providedIn: 'root'
})
export class TravelService {
  constructor(private httpClient: HttpClientService) {}

  getTravels(page: number = 0, size: number = 10, filters: TravelFilters = {}): Observable<PaginatedResponse<TravelInfo>> {
    const params: Record<string, string> = {
      page: page.toString(),
      size: size.toString(),
      ...filters
    };
    return this.httpClient.get<PaginatedResponse<TravelInfo>>('/equusid/travel/list', params);
  }

  getTravel(id: number): Observable<TravelInfo> {
    return this.httpClient.get<TravelInfo>(`/equusid/travel/get/${id}`);
  }

  addTravel(payload: AddTravelDTO): Observable<TravelInfo> {
    return this.httpClient.post<TravelInfo>('/equusid/travel/add', payload);
  }

  deleteTravel(id: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(`/equusid/travel/delete/${id}`);
  }

  getOwners(): Observable<UserInfoDTO[]> {
    return this.httpClient.get<PaginatedResponse<UserInfoDTO>>('/equusid/user/list', {
      page: '0',
      size: '100'
    }).pipe(
      // Filter only owners in the component
    );
  }

  getEquinesByOwner(ownerId: number): Observable<EquineMinInfo[]> {
    return this.httpClient.get<EquineMinInfo[]>(`/equusid/equine/list-by-owner/${ownerId}`);
  }
}