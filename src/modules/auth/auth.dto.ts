import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AccountDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(6)
  account: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
