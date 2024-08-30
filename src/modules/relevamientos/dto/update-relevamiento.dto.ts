import { PartialType } from '@nestjs/swagger';
import { CreateRelevamientoDto } from './create-relevamiento.dto';


export class UpdateRelevamientoDto extends PartialType(CreateRelevamientoDto) {
 
}
