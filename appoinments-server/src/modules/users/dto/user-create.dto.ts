import { IsEmail, IsNotEmpty, IsIn } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  phone: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsIn([2, 3])
  role: number;
}
