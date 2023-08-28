import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class PostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  encryptContent?: string;

  @IsInt()
  categoryId?: number;
}
