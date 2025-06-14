import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Quote } from './Quote';
import { Equipment } from './Equipment';

@Entity('quote_items')
export class QuoteItem extends BaseEntity {
  @Column({ name: 'quote_id' })
  quoteId: string;

  @Column({ name: 'equipment_id' })
  equipmentId: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ type: 'int' })
  duration: number;

  @Column({ name: 'daily_rate', type: 'decimal', precision: 10, scale: 2 })
  dailyRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  // Relations
  @ManyToOne(() => Quote, (quote) => quote.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quote_id' })
  quote: Quote;

  @ManyToOne(() => Equipment, (equipment) => equipment.quoteItems)
  @JoinColumn({ name: 'equipment_id' })
  equipment: Equipment;
} 