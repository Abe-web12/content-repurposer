import "reflect-metadata"
import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from "class-validator"

export class RegisterDTO {
  @IsEmail({}, { message: "Please enter a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string

  @IsString({ message: "Password must be a string" })
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @IsNotEmpty({ message: "Password is required" })
  password!: string

  @IsOptional()
  @IsString({ message: "Name must be a string" })
  @MaxLength(50, { message: "Name must be less than 50 characters" })
  name?: string
}

export class LoginDTO {
  @IsEmail({}, { message: "Please enter a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string

  @IsString({ message: "Password must be a string" })
  @IsNotEmpty({ message: "Password is required" })
  password!: string
}
