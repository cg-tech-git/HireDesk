import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { QuoteStatus } from '@hiredesk/shared';
import { BaseEntity } from './BaseEntity';
import { User } from './User';
import { QuoteItem } from './QuoteItem';
import { QuoteService } from './QuoteService';

@Entity('quotes')
export class Quote extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'quote_number', unique: true })
  quoteNumber: string;

  @Column({
    type: 'enum',
    enum: QuoteStatus,
    default: QuoteStatus.DRAFT,
  })
  status: QuoteStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  vat: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'submitted_at', type: 'timestamp with time zone', nullable: true })
  submittedAt: Date;

  @Column({ name: 'reviewed_at', type: 'timestamp with time zone', nullable: true })
  reviewedAt: Date;

  @Column({ name: 'reviewed_by', nullable: true })
  reviewedById: string;

  // Relations
  @ManyToOne(() => User, (user) => user.quotes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, (user) => user.reviewedQuotes)
  @JoinColumn({ name: 'reviewed_by' })
  reviewedBy: User;

  @OneToMany(() => QuoteItem, (quoteItem) => quoteItem.quote, { cascade: true })
  items: QuoteItem[];

  @OneToMany(() => QuoteService, (quoteService) => quoteService.quote, { cascade: true })
  services: QuoteService[];
} 