import { Injectable, NotFoundException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserService } from "src/user/user.service";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const accessToken = req?.cookies?.access_token;
          if (!accessToken) {
            return null;
          }
          return accessToken;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET_KEY,
      ignoreExpiration: false,
    });
  }

  async validate(payload) {
    const { providerAccountId } = payload;

    const user =
      await this.userService.findUserByProviderAccountId(providerAccountId);

    if (user) {
      return user;
    } else {
      throw new NotFoundException("User not found");
    }
  }
}
