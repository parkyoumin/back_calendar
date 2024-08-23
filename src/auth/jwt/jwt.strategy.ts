import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
      throw new UnauthorizedException("존재하지 않는 유저입니다.");
    }
  }
}
