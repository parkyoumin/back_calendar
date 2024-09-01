import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginRequestDto } from "./dto/login.request.dto";
import { SignupRequestDto } from "./dto/signup.request.dto";
import { UserService } from "src/user/user.service";
import { RefreshRequestDto } from "./dto/refresh.request.dto";
import { LogoutRequestDto } from "./dto/logout.request.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(loginRequestDto: LoginRequestDto) {
    const { providerAccountId } = loginRequestDto;

    const user =
      await this.userService.findUserByProviderAccountId(providerAccountId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async signUp(signupRequestDto: SignupRequestDto) {
    return await this.userService.createUser(signupRequestDto);
  }

  async logout(logoutRequestDto: LogoutRequestDto) {
    return await this.userService.updateRefreshToken(
      logoutRequestDto.providerAccountId,
      null,
    );
  }

  async generateAccessToken(providerAccountId: string) {
    const payload = { providerAccountId };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: "1h",
    });

    return accessToken;
  }

  async generateRefreshToken(id: number) {
    const payload = { id };

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_JWT_SECRET_KEY,
      expiresIn: "7d",
    });
    return refreshToken;
  }

  async refreshAccessToken(refreshRequestDto: RefreshRequestDto) {
    const user = await this.userService.findUserByProviderAccountId(
      refreshRequestDto.providerAccountId,
    );

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (refreshRequestDto.refreshToken === user.refreshToken) {
      const newAccessToken = this.generateAccessToken(
        refreshRequestDto.providerAccountId,
      );
      return newAccessToken;
    } else {
      throw new BadRequestException("Refresh token is not user's");
    }
  }
}
