import { IsEmail, IsEnum, MinLength } from 'class-validator';
import { Role } from '../enums/role.enum';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsEnum(Role, { message: 'Role must be one of: admin, manager, staff' })
  role: Role;
}
