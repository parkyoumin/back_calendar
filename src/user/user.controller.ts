import {
  BadRequestException,
  Controller,
  Get,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard())
  async findUserByProviderAccountId(@Req() req: Request) {
    const providerAccountId = req.cookies["provider_account_id"];

    if (providerAccountId) {
      const user =
        await this.userService.findUserByProviderAccountId(providerAccountId);

      return {
        status: 200,
        data: user,
      };
    } else {
      throw new BadRequestException("Have to login");
    }
  }
}
