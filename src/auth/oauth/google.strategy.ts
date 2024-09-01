import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { UserService } from "src/user/user.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private readonly userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["email", "profile"],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { id, name, emails } = profile;

    const isUser = await this.userService.isUserByProviderAccountId(id);

    const user = {
      providerAccountId: id,
      name: name.familyName + name.givenName,
      email: emails[0].value,
      type: isUser ? "login" : "signup",
    };

    return user;
  }
}
