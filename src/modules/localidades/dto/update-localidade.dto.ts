import { PartialType } from '@nestjs/swagger';
import { CreateLocalidadeDto } from './create-localidade.dto';

export class UpdateLocalidadeDto extends PartialType(CreateLocalidadeDto) {}
