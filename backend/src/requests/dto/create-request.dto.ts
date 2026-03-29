import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateRequestDto {
  @IsString({ message: 'Title is required' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title: string;

  @IsString({ message: 'Description is required' })
  @IsNotEmpty({ message: 'Description cannot be empty' })
  @MinLength(5, { message: 'Description must be at least 5 characters long' })
  description: string;
}
