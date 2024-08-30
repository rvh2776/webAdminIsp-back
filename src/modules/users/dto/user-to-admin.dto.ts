// update-user.dto.ts
import { IsBoolean, IsOptional } from 'class-validator';

export class UserToAdminDto {
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}
