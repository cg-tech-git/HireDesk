import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Quote } from './Quote';
import { Service } from './Service';

@Entity('quote_services')
export class QuoteService extends BaseEntity {
  @Column({ name: 'quote_id' })
  quoteId: string;

  @Column({ name: 'service_id' })
  serviceId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  // Relations
  @ManyToOne(() => Quote, (quote) => quote.services, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quote_id' })
  quote: Quote;

  @ManyToOne(() => Service, (service) => service.quoteServices)
  @JoinColumn({ name: 'service_id' })
  service: Service;
} 