import { Category } from 'src/categories/entities/category.entity';
export declare class Service {
    id: number;
    name: string;
    description?: string;
    durationMin: number;
    price: number;
    active: boolean;
    category: Category;
}
