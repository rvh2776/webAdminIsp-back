import { IsUUID } from 'class-validator';

export class UUIDValidationDto {
  @IsUUID()
  userId: string;
}
