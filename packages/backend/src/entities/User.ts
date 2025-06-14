import { Entity, Column, OneToOne, OneToMany, Index } from 'typeorm';
import { UserRole } from '@hiredesk/shared';
import { BaseEntity } from './BaseEntity';
import { UserProfile } from './UserProfile';
import { Quote } from './Quote';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Relations
  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile: UserProfile;

  @OneToMany(() => Quote, (quote) => quote.user)
  quotes: Quote[];

  @OneToMany(() => Quote, (quote) => quote.reviewedBy)
  reviewedQuotes: Quote[];
} 