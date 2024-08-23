import { Injectable, UnauthorizedException } from "@nestjs/common";
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

    if (user) {
      const accessToken = await this.generateAccessToken(providerAccountId);
      const refreshToken = await this.generateRefreshToken(user.id);

      await this.userService.updateRefreshToken(
        providerAccountId,
        refreshToken,
      );

      return {
        status: 200,
        data: { accessToken: accessToken, refreshToken: refreshToken },
      };
    } else {
      throw new UnauthorizedException("존재하지 않는 회원입니다.");
    }
  }

  async signUp(signupRequestDto: SignupRequestDto) {
    const user = await this.userService.createUser(signupRequestDto);

    const accessToken = await this.generateAccessToken(user.providerAccountId);
    const refreshToken = await this.generateRefreshToken(user.id);

    await this.userService.updateRefreshToken(
      user.providerAccountId,
      refreshToken,
    );

    return {
      status: 200,
      data: { accessToken: accessToken, refreshToken: refreshToken },
    };
  }

  async logout(logoutRequestDto: LogoutRequestDto) {
    await this.userService.updateRefreshToken(
      logoutRequestDto.providerAccountId,
      null,
    );

    return {
      status: 200,
      data: { message: "로그아웃 성공" },
    };
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

    if (refreshRequestDto.refreshToken === user.refreshToken) {
      const newAccesstoken = this.generateAccessToken(
        refreshRequestDto.providerAccountId,
      );
      return newAccesstoken;
    } else {
      return false;
    }
  }
}
