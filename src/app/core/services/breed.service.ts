import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { BreedBiotypeInfo, CreateBreedDTO, UpdateBreedDTO } from '../models/breed.model';

@Injectable({
  providedIn: 'root'
})
export class BreedService {
  constructor(private httpClient: HttpClientService) {}

  getBreeds(): Observable<BreedBiotypeInfo[]> {
    return this.httpClient.get<BreedBiotypeInfo[]>('/breed-biotype');
  }

  getBreedById(id: number): Observable<BreedBiotypeInfo> {
    return this.httpClient.get<BreedBiotypeInfo>(`/breed-biotype/${id}`);
  }

  createBreed(breed: CreateBreedDTO): Observable<BreedBiotypeInfo> {
    return this.httpClient.post<BreedBiotypeInfo>('/breed-biotype', breed);
  }

  updateBreed(id: number, breed: UpdateBreedDTO): Observable<BreedBiotypeInfo> {
    return this.httpClient.put<BreedBiotypeInfo>(`/breed-biotype/${id}`, breed);
  }

  deleteBreed(id: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(`/breed-biotype/${id}`);
  }
}