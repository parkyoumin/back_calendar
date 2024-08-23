import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserRequestDto {
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
