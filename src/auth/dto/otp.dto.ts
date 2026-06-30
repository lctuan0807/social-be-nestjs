import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class OtpDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsString()
  @Matches(/^\d{6}$/, { message: 'The token must be exactly 6 digits.' })
  otp: string;
}
