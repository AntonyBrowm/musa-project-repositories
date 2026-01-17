import { ProfessionalsService } from './professionals.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { Professional } from './professionals.entity';
export declare class ProfessionalsController {
    private readonly professionalsService;
    constructor(professionalsService: ProfessionalsService);
    create(dto: CreateProfessionalDto): Promise<Professional>;
    findAll(): Promise<Professional[]>;
    findOne(id: number): Promise<Professional>;
    update(id: number, dto: UpdateProfessionalDto): Promise<Professional>;
    remove(id: number): Promise<void>;
}
