import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Equipment } from './Equipment';

@Entity('rate_cards')
@Unique(['equipmentId', 'durationMin', 'durationMax'])
export class RateCard extends BaseEntity {
  @Column({ name: 'equipment_id' })
  equipmentId: string;

  @Column({ name: 'duration_min', type: 'int' })
  durationMin: number;

  @Column({ name: 'duration_max', type: 'int' })
  durationMax: number;

  @Column({ name: 'daily_rate', type: 'decimal', precision: 10, scale: 2 })
  dailyRate: number;

  @Column({ name: 'period', type: 'varchar', length: 10, default: 'Daily' })
  period: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Relations
  @ManyToOne(() => Equipment, (equipment) => equipment.rateCards)
  @JoinColumn({ name: 'equipment_id' })
  equipment: Equipment;
} 