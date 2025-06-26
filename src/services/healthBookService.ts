import { httpClient } from '@/lib/http-client';

export interface HealthBookMinInfo {
  id: number;
  identification: string;
  state: string;
  equineId: number;
  equineName: string;
  deleted: boolean;
  updatedAt: string;
}

export interface HealthBookPage {
  content: HealthBookMinInfo[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

interface BackendResponse<T> {
  data: T;
  success: boolean;
  error?: any;
}

export const healthBookService = {
  async getHealthBooks(page = 0, size = 10) {
    const res = await httpClient.get<BackendResponse<HealthBookPage>>(`/equusid/health-book/list?page=${page}&size=${size}`);
    return res.data;
  },
  // Obtener detalle de libreta sanitaria
  async getHealthBook(healthBookId: number) {
    const res = await httpClient.get<BackendResponse<any>>(`/equusid/health-book/get/${healthBookId}`);
    return res.data;
  },

  // No existe endpoint de edición general, solo de aprobar, asociar veterinario, etc.
  // async editHealthBook(...) { ... }

  // Baja lógica: desasociar de veterinario (no hay endpoint de baja directa, se hace desde Equine)
  // async removeHealthBook(...) { ... }
}; 