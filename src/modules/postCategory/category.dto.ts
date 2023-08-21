import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CategoryDto {
  @IsString()
  @MaxLength(8)
  @IsNotEmpty()
  name: string;
}
