import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { UserInfoDTO, PaginatedResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClientService) {}

  getUsers(page: number = 0, size: number = 10, sort: string = 'id'): Observable<PaginatedResponse<UserInfoDTO>> {
    return this.httpClient.get<PaginatedResponse<UserInfoDTO>>('/equusid/user/list', {
      page: page.toString(),
      size: size.toString(),
      sort
    });
  }

  updateUser(id: number, user: Partial<UserInfoDTO>): Observable<UserInfoDTO> {
    return this.httpClient.patch<UserInfoDTO>(`/equusid/user/edit/${id}`, user);
  }

  updateAccountInfo(user: Partial<UserInfoDTO>): Observable<UserInfoDTO> {
    return this.httpClient.patch<UserInfoDTO>('/equusid/user/update-account-info', user);
  }

  updateProfilePicture(userId: number, file: File): Observable<UserInfoDTO> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.patch<UserInfoDTO>(`/equusid/user/update-profile-picture/${userId}`, formData);
  }

  deleteUser(id: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(`/equusid/user/delete/${id}`);
  }
}