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

export interface TravelFilters {
  searchTerm?: string;
  equineId?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}