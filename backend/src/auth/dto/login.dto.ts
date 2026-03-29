import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @IsString({ message: 'Password is required' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}
