import { httpClient } from '@/lib/http-client';

export interface StableInfoDTO {
  id: number;
  name: string;
  alias: string;
  phoneNumber: string;
  identificationType: string;
  identification: string;
  renspa: string;
  type: {
    id: number;
    name: string;
    optionValue: string;
  };
  country: string;
  province: string;
  city: string;
  address: string;
  owner: MinUserInfoDTO;
  picture?: string;
  deleted: boolean;
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

export interface AddStableDTO {
  name: string;
  alias?: string;
  phoneNumber?: string;
  identificationType?: string;
  identification?: string;
  renspa?: string;
  typeId?: number;
  radicatedSince?: string;
  country?: string;
  province?: string;
  city?: string;
  address?: string;
  ownerId?: number;
}

export interface EditStableDTO extends AddStableDTO {}

export interface StableTypeDTO {
  id: number;
  name: string;
  label: string;
}

export interface AssignManagersDTO {
  managersToAddIds: number[];
}

export interface ChangeOwnerDTO {
  stableId: number;
  newOwnerId: number;
}

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
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

export const stableService = {
  // Obtener establecimientos con paginación
  getStables: async (page: number = 0, size: number = 10, sort: string = 'id'): Promise<PaginatedResponse<StableInfoDTO>> => {
    const response = await httpClient.get<ApiResponse<PaginatedResponse<StableInfoDTO>>>('/equusid/stable/list', {
      params: {
        page: page.toString(),
        size: size.toString(),
        sort,
      },
    });
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.descripcion || 'Error al obtener los establecimientos');
    }
  },

  // Obtener un establecimiento por ID
  getStableById: async (id: number): Promise<StableInfoDTO> => {
    const response = await httpClient.get<ApiResponse<StableInfoDTO>>(`/equusid/stable/get/${id}`);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.descripcion || 'Error al obtener el establecimiento');
    }
  },

  // Crear un nuevo establecimiento
  createStable: async (stable: AddStableDTO): Promise<StableInfoDTO> => {
    const response = await httpClient.post<ApiResponse<StableInfoDTO>>('/equusid/stable/add', stable);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.descripcion || 'Error al crear el establecimiento');
    }
  },

  // Actualizar un establecimiento existente
  updateStable: async (id: number, stable: EditStableDTO): Promise<StableInfoDTO> => {
    const response = await httpClient.patch<ApiResponse<StableInfoDTO>>(`/equusid/stable/edit/${id}`, stable);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.descripcion || 'Error al actualizar el establecimiento');
    }
  },

  // Eliminar un establecimiento
  deleteStable: async (id: number): Promise<boolean> => {
    const response = await httpClient.delete<ApiResponse<boolean>>(`/equusid/stable/remove/${id}`);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.descripcion || 'Error al eliminar el establecimiento');
    }
  },

  // Buscar establecimientos
  searchStables: async (renspa?: string, alias?: string): Promise<StableInfoDTO[]> => {
    const params: Record<string, string> = {};
    if (renspa) params.renspa = renspa;
    if (alias) params.alias = alias;
    
    const response = await httpClient.get<ApiResponse<StableInfoDTO[]>>('/equusid/stable/search', { params });
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.descripcion || 'Error al buscar establecimientos');
    }
  },

  // Obtener tipos de establecimiento
  getStableTypes: async (): Promise<StableTypeDTO[]> => {
    const response = await httpClient.get<ApiResponse<StableTypeDTO[]>>('/equusid/stable/types');
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.descripcion || 'Error al obtener los tipos de establecimiento');
    }
  },

  // Obtener establecimientos por manager
  getStablesByManager: async (managerId: number): Promise<StableInfoDTO[]> => {
    const response = await httpClient.get<ApiResponse<StableInfoDTO[]>>(`/equusid/stable/get-stables-by-manager/${managerId}`);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.descripcion || 'Error al obtener los establecimientos del manager');
    }
  },

  // Obtener equinos de un establecimiento
  getEquinesByStable: async (stableId: number): Promise<any[]> => {
    const response = await httpClient.get<ApiResponse<any[]>>(`/equusid/stable/get-equines-by-stable/${stableId}`);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.descripcion || 'Error al obtener los equinos del establecimiento');
    }
  },

  // Obtener administradores de un establecimiento
  getAdministratorsByStable: async (stableId: number): Promise<MinUserInfoDTO[]> => {
    const response = await httpClient.get<ApiResponse<MinUserInfoDTO[]>>(`/equusid/stable/get-administrators-by-stable/${stableId}`);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.descripcion || 'Error al obtener los administradores del establecimiento');
    }
  },

  // Obtener managers de un establecimiento
  getManagersByStable: async (stableId: number): Promise<MinUserInfoDTO[]> => {
    const response = await httpClient.get<ApiResponse<MinUserInfoDTO[]>>(`/equusid/stable/get-managers-by-stable/${stableId}`);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.descripcion || 'Error al obtener los managers del establecimiento');
    }
  },

  // Asignar managers a un establecimiento
  assignManagers: async (stableId: number, managersToAddIds: number[]): Promise<boolean> => {
    const response = await httpClient.patch<ApiResponse<boolean>>(`/equusid/stable/assign-managers/${stableId}`, {
      managersToAddIds
    });
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.descripcion || 'Error al asignar managers al establecimiento');
    }
  },

  // Remover manager de un establecimiento
  removeManager: async (stableId: number, managerId: number): Promise<boolean> => {
    const response = await httpClient.patch<ApiResponse<boolean>>(`/equusid/stable/remove-managers/${stableId}/${managerId}`);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.descripcion || 'Error al remover el manager del establecimiento');
    }
  },

  // Cambiar owner de un establecimiento
  changeOwner: async (stableId: number, newOwnerId: number): Promise<boolean> => {
    const response = await httpClient.patch<ApiResponse<boolean>>('/equusid/stable/change-owner', {
      stableId,
      newOwnerId
    });
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.descripcion || 'Error al cambiar el owner del establecimiento');
    }
  },

  // Actualizar foto de perfil
  updateProfilePicture: async (stableId: number, file: File): Promise<StableInfoDTO> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await httpClient.patch<ApiResponse<StableInfoDTO>>(`/equusid/stable/update-profile-picture/${stableId}`, formData);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error?.descripcion || 'Error al actualizar la foto de perfil');
    }
  },
}; 