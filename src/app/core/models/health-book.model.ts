export interface HealthBookMinInfo {
  id: number;
  identification: string;
  state: string;
  equineId: number;
  equineName: string;
  deleted: boolean;
  updatedAt: string;
}

export interface HealthBookInfo {
  id: number;
  senasaId: string;
  state: string;
  approvedAt: string;
  deleted: boolean;
  updatedAt: string;
  extractionInfoList: BloodExtractionInfo[];
  vaccineApplicationInfoList: VaccineApplicationInfo[];
  equineMinInfo: EquineMinInfo;
  approvalVeterinarian: MinUserInfoDTO;
}

export interface BloodExtractionInfo {
  id: number;
  healthBookId: number;
  extractionDate: string;
  veterinarianName: string;
  veterinarianLastName: string;
  veterinarianIdentification: string;
  deleted: boolean;
}

export interface VaccineApplicationInfo {
  id: number;
  vaccineCommercialName: string;
  applicationDate: string;
  vaccineDrug: string;
  vaccineGTIN: string;
  vaccineManufacturer: string;
  vaccineCountry: string;
  vaccineLotNumber: string;
  vaccineFabricationDate: string;
  vaccineExpirationDate: string;
  vaccineApplicationNumber: number;
  veterinarianName: string;
  veterinarianLastName: string;
  veterinarianIdentification: string;
  deleted: boolean;
}

export interface EquineMinInfo {
  id: number;
  bioId: string;
  isIrisEnrolled: boolean;
  name: string;
  healthBookId: number;
  healthBookIdentification: string;
  healthBookStatus: string;
  chip: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}