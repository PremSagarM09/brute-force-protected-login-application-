import { Request } from 'express';
export interface ResponseDto {
  status?: boolean;
  data?: any;
  message?: string;
  error?: any;
  detail?: any;
  statusCode?: number;
}

export interface ValidateResponseDto {
  statusCode: number;
  status: boolean;
  data?: any;
  message?: string;
  error?: any;
  detail?: any;
}

export interface PaginationFilter {
  pagination?: boolean;
  page?: number;
  count?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  excel?: boolean;
  start_date?: string;
  end_date?: string;
}

export interface ExtendedRequest extends Request {
  user?: JwtDTO;
}

export enum DateFormats {
  'MMM_DD_YYYY' = 'MMM-DD-YYYY',
}

export enum TokenisationValues {
  ENCRYPTING = 'ENCRYPTING',
  DECRYPTING = 'DECRYPTING',
}

export interface JwtDTO {
  username?: string;
  email: string;
  userId: number;
}

export interface FilterDTO {
  id?: number;
  page?: number;
  pagination?: boolean;
  limit?: number;
  order?: string;
}
