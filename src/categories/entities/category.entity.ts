import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Ej: "Pestañas", "Uñas", "Ceja", "Cortes"

  @Column({ nullable: true })
  description?: string;

  @Column({ default: true })
  active: boolean;
}
