<<<<<<< HEAD
export class CreateUserDto {}
=======
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6)
  code: string;
}
>>>>>>> email-login-backend
