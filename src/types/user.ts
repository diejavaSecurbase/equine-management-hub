export interface UserInfoDTO {
  id: number;
  name: string;
  lastName: string;
  identificationType: string;
  identification: string;
  enrolled: boolean;
  email: string;
  birthday?: string;
  phoneNumber?: string;
  country?: string;
  province?: string;
  city?: string;
  address?: string;
  profilePicture?: string;
  senasaId?: string;
  veterinarianCollegeId?: string;
  acceptNotifications?: boolean;
}

export interface UserState {
  users: UserInfoDTO[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
} 