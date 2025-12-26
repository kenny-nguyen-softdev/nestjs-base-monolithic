import { StaffType } from './staff.types';

export interface LoginByPasswordResponse {
  staff: StaffType;
  accessToken: string;
  refreshToken: string;
}
