import { Professional } from 'src/professionals/professionals.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('availability_rules')
export class AvailabilityRule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Professional, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;

  @Column({ name: 'day_of_week', type: 'int' }) // 0 = domingo .. 6 = sábado
  dayOfWeek: number;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string; // "09:00:00"

  @Column({ name: 'end_time', type: 'time' })
  endTime: string; // "18:00:00"

  @Column({ default: true })
  active: boolean;
}
