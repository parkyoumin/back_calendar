import { Body, Controller, Post } from "@nestjs/common";
import { LoginRequestDto } from "./dto/login.request.dto";
import { AuthService } from "./auth.service";
import { SignupRequestDto } from "./dto/signup.request.dto";
import { RefreshRequestDto } from "./dto/refresh.request.dto";
import { LogoutRequestDto } from "./dto/logout.request.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  async login(@Body() data: LoginRequestDto) {
    return await this.authService.login(data);
  }

  @Post("/signup")
  async signUp(@Body() signupRequestDto: SignupRequestDto) {
    return await this.authService.signUp(signupRequestDto);
  }

  @Post("/refresh")
  async refresh(@Body() refreshRequestDto: RefreshRequestDto) {
    return await this.authService.refreshAccessToken(refreshRequestDto);
  }

  @Post("/logout")
  async logout(@Body() logoutRequestDto: LogoutRequestDto) {
    return await this.authService.logout(logoutRequestDto);
  }
}
