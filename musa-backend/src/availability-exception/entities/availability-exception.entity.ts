import { Professional } from 'src/professionals/professionals.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('availability_exceptions')
export class AvailabilityException {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Professional, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;

  @Column({ type: 'date' })
  date: string; // "2025-11-02"

  @Column({ name: 'start_time', type: 'time', nullable: true })
  startTime?: string;

  @Column({ name: 'end_time', type: 'time', nullable: true })
  endTime?: string;

  @Column({ default: 'custom' })
  type: string; // 'holiday' | 'vacation' | 'custom'
}
