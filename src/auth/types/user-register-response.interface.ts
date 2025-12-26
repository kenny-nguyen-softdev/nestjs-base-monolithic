import { StaffType } from './staff.types';

export interface StaffRegisterResponse {
  staff: StaffType;
  accessToken: string;
  refreshToken: string;
}
