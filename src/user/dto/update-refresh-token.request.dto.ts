import { IsNotEmpty, IsString } from "class-validator";

export class updateRefreshTokenRequestDto {
  @IsString()
  @IsNotEmpty()
  providerAccountId: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
