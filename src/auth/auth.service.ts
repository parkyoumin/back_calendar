import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUser } from "src/types/user.type";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(providerAccountId: string) {
    const user =
      await this.userService.findUserByProviderAccountId(providerAccountId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async signUp(createUser: CreateUser) {
    return await this.userService.createUser(createUser);
  }

  async logout(providerAccountId: string) {
    return await this.userService.updateRefreshToken(providerAccountId, null);
  }

  async withdraw(providerAccountId: string) {
    return await this.userService.deleteUser(providerAccountId);
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

  async refreshAccessToken(providerAccountId: string, refreshToken: string) {
    const user =
      await this.userService.findUserByProviderAccountId(providerAccountId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (refreshToken === user.refreshToken) {
      const newAccessToken = this.generateAccessToken(providerAccountId);
      return newAccessToken;
    } else {
      throw new BadRequestException("Refresh token is not user's");
    }
  }
}
