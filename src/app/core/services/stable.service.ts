import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { StableInfoDTO, AddStableDTO, StableTypeDTO, MinUserInfoDTO } from '../models/stable.model';
import { PaginatedResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StableService {
  constructor(private httpClient: HttpClientService) {}

  getStables(page: number = 0, size: number = 10, sort: string = 'id'): Observable<PaginatedResponse<StableInfoDTO>> {
    return this.httpClient.get<PaginatedResponse<StableInfoDTO>>('/equusid/stable/list', {
      page: page.toString(),
      size: size.toString(),
      sort
    });
  }

  getStableById(id: number): Observable<StableInfoDTO> {
    return this.httpClient.get<StableInfoDTO>(`/equusid/stable/get/${id}`);
  }

  createStable(stable: AddStableDTO): Observable<StableInfoDTO> {
    return this.httpClient.post<StableInfoDTO>('/equusid/stable/add', stable);
  }

  updateStable(id: number, stable: AddStableDTO): Observable<StableInfoDTO> {
    return this.httpClient.patch<StableInfoDTO>(`/equusid/stable/edit/${id}`, stable);
  }

  deleteStable(id: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(`/equusid/stable/remove/${id}`);
  }

  getStableTypes(): Observable<StableTypeDTO[]> {
    return this.httpClient.get<StableTypeDTO[]>('/equusid/stable/types');
  }

  searchStables(renspa?: string, alias?: string): Observable<StableInfoDTO[]> {
    const params: Record<string, string> = {};
    if (renspa) params['renspa'] = renspa;
    if (alias) params['alias'] = alias;
    return this.httpClient.get<StableInfoDTO[]>('/equusid/stable/search', params);
  }

  getManagersByStable(stableId: number): Observable<MinUserInfoDTO[]> {
    return this.httpClient.get<MinUserInfoDTO[]>(`/equusid/stable/get-managers-by-stable/${stableId}`);
  }

  assignManagers(stableId: number, managersToAddIds: number[]): Observable<boolean> {
    return this.httpClient.patch<boolean>(`/equusid/stable/assign-managers/${stableId}`, {
      managersToAddIds
    });
  }
}