import { PartialType } from '@nestjs/mapped-types';
import { LoginUserDto } from './login-user.dto';

export class UpdateUserDto extends PartialType(LoginUserDto) {}
