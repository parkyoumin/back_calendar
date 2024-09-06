import {
  BadRequestException,
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
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
        const user = await this.authService.login(providerAccountId);

        const accessToken =
          await this.authService.generateAccessToken(providerAccountId);
        const refreshToken = await this.authService.generateRefreshToken(
          user.id,
        );

        await this.userService.updateRefreshToken(
          providerAccountId,
          refreshToken,
        );

        res.cookie("provider_account_id", providerAccountId, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        });
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

        res.cookie("provider_account_id", providerAccountId, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        });
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

  @Get("/refresh")
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const providerAccountId = req.cookies["provider_account_id"];

    if (providerAccountId) {
      const user =
        await this.userService.findUserByProviderAccountId(providerAccountId);

      const refreshToken = req.cookies["refresh_token"];

      const newAccessToken = await this.authService.refreshAccessToken(
        providerAccountId,
        refreshToken,
      );
      const newRefreshToken = await this.authService.generateRefreshToken(
        user.id,
      );

      await this.userService.updateRefreshToken(
        providerAccountId,
        newRefreshToken,
      );

      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
      res.cookie("refresh_token", newRefreshToken, {
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
    } else {
      throw new BadRequestException("Have to login");
    }
  }

  @Get("/logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const providerAccountId = req.cookies["provider_account_id"];

    if (providerAccountId) {
      await this.authService.logout(providerAccountId);

      res.clearCookie("provider_account_id", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
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
    } else {
      throw new BadRequestException("Have to login");
    }
  }
}
