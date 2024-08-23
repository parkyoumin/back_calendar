import { IsNotEmpty, IsString } from "class-validator";

export class RefreshRequestDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @IsString()
  @IsNotEmpty()
  providerAccountId: string;
}
