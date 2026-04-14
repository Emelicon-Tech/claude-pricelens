import { IsEmail, IsString, MinLength, IsOptional, IsPhoneNumber, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecureP@ss1' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiPropertyOptional({ example: '+2348012345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'clxxxxxxxxxxxxxxxxx', description: 'State ID' })
  @IsString()
  stateId: string;

  @ApiProperty({ example: 'clxxxxxxxxxxxxxxxxx', description: 'City ID' })
  @IsString()
  cityId: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecureP@ss1' })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class VerifyEmailDto {
  @ApiProperty()
  @IsString()
  token: string;
}

export class PhoneLoginDto {
  @ApiProperty({ example: '+2348012345678' })
  @IsString()
  phone: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+2348012345678' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}
