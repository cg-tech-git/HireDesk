import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Category } from './Category';
import { RateCard } from './RateCard';
import { QuoteItem } from './QuoteItem';

@Entity('equipment')
export class Equipment extends BaseEntity {
  @Column({ name: 'category_id' })
  categoryId: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'model_id', nullable: true })
  modelId?: string;

  @Column({ nullable: true })
  manufacturer?: string;

  @Column({ type: 'jsonb', default: {} })
  specifications: Record<string, string | number>;

  @Column({ type: 'text', array: true, default: [] })
  images: string[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Relations
  @ManyToOne(() => Category, (category) => category.equipment)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => RateCard, (rateCard) => rateCard.equipment)
  rateCards: RateCard[];

  @OneToMany(() => QuoteItem, (quoteItem) => quoteItem.equipment)
  quoteItems: QuoteItem[];
} 