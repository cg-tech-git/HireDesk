import { Entity, Column, OneToMany } from 'typeorm';
import { ServiceType } from '@hiredesk/shared';
import { BaseEntity } from './BaseEntity';
import { QuoteService } from './QuoteService';

@Entity('services')
export class Service extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: ServiceType,
  })
  type: ServiceType;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Relations
  @OneToMany(() => QuoteService, (quoteService) => quoteService.service)
  quoteServices: QuoteService[];
} 