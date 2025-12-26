import { Supplier } from '../../supplier/entities/supplier.entity';
import { Staff } from '../../staff/entities/staff.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';

@Entity({ name: 'BaseUsers' })
export class BaseUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  avatarImage: string;

  @Column({ nullable: true, default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;

  @OneToOne(() => Staff, (staff) => staff.baseUser)
  staff: Staff;

  @OneToOne(() => Supplier, (supplier) => supplier.baseUser)
  supplier: Supplier;

  @OneToMany(() => Customer, (customer) => customer.baseUser)
  customers: Customer[];
}

export const baseUserCriteriaFields = [
  'name',
  'code',
  'email',
  'phoneNumber',
  'address',
  'avatarImage',
  'isActive',
  'updatedAt',
];

export const defaultRelations = ['staff', 'supplier'];
