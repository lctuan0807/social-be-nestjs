
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({
    message: 'Username is required',
  })
  @IsString()
  @MinLength(3, {
    message: 'Username must be at least 3 characters',
  })
  username: string;

  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsEmail({}, {
    message: 'Please provide a valid email address',
  })
  email: string
  
  @IsNotEmpty({
    message: 'Password is required',
  })
  @IsString()
  @MinLength(8, {
    message: 'Password must be at least 8 characters',
  })
  password: string
}
