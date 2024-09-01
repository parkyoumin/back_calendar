import { Injectable, NotFoundException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          const accessToken = request.cookies["access_token"];
          console.log(accessToken);

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
