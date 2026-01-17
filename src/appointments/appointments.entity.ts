import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Service } from '../services/services.entity';
import { Professional } from '../professionals/professionals.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'client_name' })
  clientName: string;

  @Column({ name: 'client_email', nullable: true })
  clientEmail?: string;

  @Column({ name: 'client_number', type: 'varchar', length: 20 })
  clientNumber: string;
  // Relación con Service
  @ManyToOne(() => Service, { eager: true })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ name: 'service_id' })
  serviceId: number;

  // Relación con Professional (opcional)
  @ManyToOne(() => Professional, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;

  @Column({ name: 'professional_id' })
  professionalId: number;

  // Horario de la cita
  @Column({ name: 'start_at', type: 'timestamptz' })
  startAt: Date;

  @Column({ name: 'end_at', type: 'timestamptz' })
  endAt: Date;

  @Column({ nullable: true })
  note?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalCost: number;

  @Column({ default: 'scheduled' })
  status: 'scheduled' | 'completed' | 'cancelled';

  @Column({ default: 'client' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
