import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { User } from './User';

@Entity('user_profiles')
export class UserProfile extends BaseEntity {
  @Column({ name: 'user_id', unique: true })
  userId: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'address_street', nullable: true })
  addressStreet: string;

  @Column({ name: 'address_city', nullable: true })
  addressCity: string;

  @Column({ name: 'address_postal_code', nullable: true })
  addressPostalCode: string;

  @Column({ name: 'address_country', nullable: true })
  addressCountry: string;

  // Relations
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user: User;
} 