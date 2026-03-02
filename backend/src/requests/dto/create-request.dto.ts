import { MinLength } from 'class-validator';

export class CreateRequestDto {
  @MinLength(3)
  title: string;

  @MinLength(5)
  description: string;
}
