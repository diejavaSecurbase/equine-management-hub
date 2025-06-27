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

export interface StableTypeDTO {
  id: number;
  name: string;
  label: string;
}