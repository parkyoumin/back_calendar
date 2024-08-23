import { IsNotEmpty, IsString } from "class-validator";

export class LoginRequestDto {
  @IsString()
  @IsNotEmpty()
  providerAccountId: string;
}
