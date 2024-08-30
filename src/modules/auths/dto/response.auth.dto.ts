import { PartialType } from '@nestjs/swagger';
import { SignInDto } from './sign-in.dto';

export class ResponseAuthDto extends PartialType(SignInDto) {}
