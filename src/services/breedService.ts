import { httpClient } from '@/lib/http-client';

export interface BreedBiotypeInfo {
  id: number;
  name: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    codigo: number;
    descripcion: string;
    tipo: string;
  };
}

export const breedService = {
  // Obtener todas las razas
  getBreeds: async (): Promise<BreedBiotypeInfo[]> => {
    const response = await httpClient.get<ApiResponse<BreedBiotypeInfo[]>>('/breed-biotype');
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.descripcion || 'Error al obtener las razas');
    }
  },

  // Obtener una raza por ID
  getBreedById: async (id: number): Promise<BreedBiotypeInfo> => {
    const response = await httpClient.get<ApiResponse<BreedBiotypeInfo>>(`/breed-biotype/${id}`);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.descripcion || 'Error al obtener la raza');
    }
  },

  // Crear una nueva raza
  createBreed: async (breed: Omit<BreedBiotypeInfo, 'id'>): Promise<BreedBiotypeInfo> => {
    const response = await httpClient.post<ApiResponse<BreedBiotypeInfo>>('/breed-biotype', breed);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.descripcion || 'Error al crear la raza');
    }
  },

  // Actualizar una raza existente
  updateBreed: async (id: number, breed: Omit<BreedBiotypeInfo, 'id'>): Promise<BreedBiotypeInfo> => {
    const response = await httpClient.put<ApiResponse<BreedBiotypeInfo>>(`/breed-biotype/${id}`, breed);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.descripcion || 'Error al actualizar la raza');
    }
  },

  // Eliminar una raza
  deleteBreed: async (id: number): Promise<boolean> => {
    const response = await httpClient.delete<ApiResponse<boolean>>(`/breed-biotype/${id}`);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.descripcion || 'Error al eliminar la raza');
    }
  },
}; 