import { Category } from 'src/categories/entities/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('professionals')
export class Professional {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 20 })
  number: string;
  
  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ default: true })
  active: boolean;

  @ManyToMany(() => Category, { eager: false })
  @JoinTable({
    name: 'professional_categories',
    joinColumn: { name: 'professional_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories?: Category[];
}
