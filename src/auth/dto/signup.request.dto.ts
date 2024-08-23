import { IsNotEmpty, IsString } from "class-validator";

export class SignupRequestDto {
  @IsString()
  @IsNotEmpty()
  providerAccountId: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
