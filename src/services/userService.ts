import { UserInfoDTO } from '@/types/user';
import { httpClient } from '@/lib/http-client';

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    message: string;
    type: string;
  };
}

export const userService = {
  getUsers: async (page: number = 0, size: number = 10, sort: string = 'id'): Promise<PaginatedResponse<UserInfoDTO>> => {
    const response = await httpClient.get<ApiResponse<PaginatedResponse<UserInfoDTO>>>('/equusid/user/list', {
      params: {
        page: page.toString(),
        size: size.toString(),
        sort,
      },
    });
    return response.data;
  },

  login: async (email: string, password: string): Promise<ApiResponse<{ token: string }>> => {
    const response = await fetch('http://localhost:8090/equusid/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    return response.json();
  },

  updateUser: async (id: number, user: Partial<UserInfoDTO>): Promise<UserInfoDTO> => {
    const response = await httpClient.patch<ApiResponse<UserInfoDTO>>(`/equusid/user/edit/${id}`, user);
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error?.message || 'Error al actualizar el usuario');
    }
  },

  updateAccountInfo: async (user: Partial<UserInfoDTO>): Promise<UserInfoDTO> => {
    try {
      const response = await httpClient.patch<ApiResponse<UserInfoDTO>>('/equusid/user/update-account-info', user);
      
      // Try to handle the response as the standard API response structure
      const responseData = response.data as any;
      
      if (responseData && responseData.success && responseData.data) {
        return responseData.data;
      }
      
      if (responseData && responseData.error) {
        throw new Error(responseData.error.message || 'Error al actualizar la información de cuenta');
      }
      
      // If no standard structure, return the response as is
      return response.data as UserInfoDTO;
    } catch (error: any) {
      // Handle axios errors
      if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Error al actualizar la información de cuenta');
      }
    }
  },

  updateProfilePicture: async (userId: number, profilePicture: string): Promise<UserInfoDTO> => {
    try {
      // Convert base64 to blob and create FormData
      const base64Response = await fetch(`data:image/jpeg;base64,${profilePicture}`);
      const blob = await base64Response.blob();
      
      const formData = new FormData();
      formData.append('file', blob, 'profile-picture.png');

      const response = await httpClient.patch<ApiResponse<UserInfoDTO>>(`/equusid/user/update-profile-picture/${userId}`, formData);
      
      // Try to handle the response as the standard API response structure
      const responseData = response.data as any;
      
      if (responseData && responseData.success && responseData.data) {
        return responseData.data;
      }
      
      if (responseData && responseData.error) {
        throw new Error(responseData.error.message || 'Error al actualizar la foto de perfil');
      }
      
      // If no standard structure, return the response as is
      return response.data as UserInfoDTO;
    } catch (error: any) {
      // Handle axios errors
      if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Error al actualizar la foto de perfil');
      }
    }
  },
}; 