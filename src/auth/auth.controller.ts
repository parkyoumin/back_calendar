import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RefreshRequestDto } from "./dto/refresh.request.dto";
import { LogoutRequestDto } from "./dto/logout.request.dto";
import { Response } from "express";
import { UserService } from "src/user/user.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get("/google")
  @UseGuards(AuthGuard("google"))
  async googleLogin() {}

  @Get("/google/callback")
  @UseGuards(AuthGuard("google"))
  async googleLoginCallback(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user } = req;
    const { providerAccountId, email, name } = user;

    switch (user.type) {
      case "login": {
        const loginRequestDto = { providerAccountId };
        const user = await this.authService.login(loginRequestDto);

        const accessToken =
          await this.authService.generateAccessToken(providerAccountId);
        const refreshToken = await this.authService.generateRefreshToken(
          user.id,
        );

        await this.userService.updateRefreshToken(
          providerAccountId,
          refreshToken,
        );

        res.setHeader("Authoriztaion", "Bearer " + accessToken);
        res.cookie("access_token", accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        });
        res.cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        });

        res.redirect("http://localhost:3000");
        break;
      }

      case "signup": {
        const signupRequestDto = { providerAccountId, email, name };
        const user = await this.authService.signUp(signupRequestDto);

        const accessToken =
          await this.authService.generateAccessToken(providerAccountId);
        const refreshToken = await this.authService.generateRefreshToken(
          user.id,
        );

        await this.userService.updateRefreshToken(
          providerAccountId,
          refreshToken,
        );

        res.cookie("access_token", accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        });
        res.cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        });

        res.redirect("http://localhost:3000");
        break;
      }
    }
  }

  @Post("/refresh")
  async refresh(
    @Body() refreshRequestDto: RefreshRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const newAccessToken =
      await this.authService.refreshAccessToken(refreshRequestDto);

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.send({
      status: 200,
      data: {
        message: "refresh access token success",
      },
    });
  }

  @Post("/logout")
  async logout(
    @Body() logoutRequestDto: LogoutRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(logoutRequestDto);

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.send({
      status: 200,
      data: {
        message: "logout success",
      },
    });
  }
}
