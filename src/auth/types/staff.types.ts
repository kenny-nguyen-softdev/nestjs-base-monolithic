import { Staff } from 'src/staff/entities/staff.entity';

export type StaffType = Omit<Staff, 'password'>;
