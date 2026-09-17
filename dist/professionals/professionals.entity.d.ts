import { Category } from 'src/categories/entities/category.entity';
export declare class Professional {
    id: number;
    name: string;
    number: string;
    email: string;
    color?: string;
    active: boolean;
    categories?: Category[];
}
