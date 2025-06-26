import { httpClient } from '@/lib/http-client';

// Tipos DTOs (adaptados del backend)
export interface LocationInfo {
  id: number;
  alias: string;
  country: string;
  province: string;
  city: string;
  address: string;
  stableName: string;
  stableRenspa: string;
  eventName: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MinUserInfoDTO {
  id: number;
  name: string;
  lastName: string;
  identification: string;
  email: string;
  profile: string;
  deleted: boolean;
}

export interface EquineMinInfo {
  id: number;
  name: string;
  chip: string;
}

export interface TravelInfo {
  id: number;
  reference: string;
  origin: LocationInfo;
  destination: LocationInfo;
  travelStatus: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'DONE' | 'CANCELED';
  startAt: string;
  endsAt: string;
  creator: MinUserInfoDTO;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  equines?: EquineMinInfo[];
  motivo?: string;
}

export interface AddLocationDTO {
  alias: string;
  country: string;
  province: string;
  city: string;
  address: string;
  stableId?: number;
  eventId?: number;
}

export interface AddTravelDTO {
  reference: string;
  origin: AddLocationDTO;
  destination: AddLocationDTO;
  startAt: string;
  endsAt: string;
  creatorId: number;
  equineIds: number[];
}

export interface EditTravelDTO {
  reference: string;
  origin: AddLocationDTO;
  destination: AddLocationDTO;
  startAt: string;
  equineIds: number[];
}

export interface TravelPage {
  content: TravelInfo[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

// Respuesta genérica del backend
interface BackendResponse<T> {
  data: T;
  success: boolean;
  error?: any;
}

export const travelService = {
  async getTravels(page = 0, size = 10, filters: any = {}) {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
      ...filters
    });
    const res = await httpClient.get<BackendResponse<TravelPage>>(`/equusid/travel/list?${params.toString()}`);
    return res.data.data;
  },

  async getTravel(id: number) {
    const res = await httpClient.get<BackendResponse<TravelInfo>>(`/equusid/travel/get/${id}`);
    return res.data.data;
  },

  async addTravel(payload: AddTravelDTO) {
    const res = await httpClient.post<BackendResponse<TravelInfo>>(`/equusid/travel/add`, payload);
    return res.data.data;
  },

  async editTravel(id: number, payload: EditTravelDTO) {
    const res = await httpClient.patch<BackendResponse<TravelInfo>>(`/equusid/travel/edit/${id}`, payload);
    return res.data.data;
  },

  async deleteTravel(id: number) {
    const res = await httpClient.delete<BackendResponse<boolean>>(`/equusid/travel/delete/${id}`);
    return res.data.data;
  },

  async confirmDestination(id: number) {
    const res = await httpClient.patch<BackendResponse<TravelInfo>>(`/equusid/travel/confirm-destination/${id}`, {});
    return res.data.data;
  },

  async markDone(id: number) {
    const res = await httpClient.patch<BackendResponse<TravelInfo>>(`/equusid/travel/mark-done/${id}`, {});
    return res.data.data;
  },

  async cancelTravel(id: number) {
    const res = await httpClient.delete<BackendResponse<boolean>>(`/equusid/travel/cancel/${id}`);
    return res.data.data;
  },

  // Obtener propietarios (usuarios con perfil PROPIETARIO)
  async getOwners() {
    // Pide hasta 100 usuarios, puedes ajustar el size si hay más propietarios
    const res = await httpClient.get<any>('/equusid/user/list?page=0&size=100');
    let users = [];
    if (Array.isArray(res.data?.data?.content)) {
      users = res.data.data.content;
    } else if (Array.isArray(res.data?.content)) {
      users = res.data.content;
    } else if (Array.isArray(res.data)) {
      users = res.data;
    } else {
      console.error('Respuesta inesperada de /equusid/user/list:', res.data);
      return [];
    }
    return users.filter((u: any) => u.profile === 'PROPIETARIO');
  },

  // Obtener equinos por ownerId
  async getEquinesByOwner(ownerId: number) {
    const res = await httpClient.get<any>(`/equusid/equine/list-by-owner/${ownerId}`);
    return res.data?.data || res.data || [];
  }
}; 