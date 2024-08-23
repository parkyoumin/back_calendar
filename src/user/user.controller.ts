import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/is")
  async isUserByProviderAccountId(
    @Query() query: { providerAccountId: string },
  ) {
    const { providerAccountId } = query;
    const user =
      await this.userService.isUserByProviderAccountId(providerAccountId);

    if (user) {
      return { status: 200, data: true };
    } else {
      return { status: 200, data: false };
    }
  }

  @Get()
  @UseGuards(AuthGuard())
  async findUserByProviderAccountId(
    @Query() query: { providerAccountId: string },
  ) {
    const { providerAccountId } = query;
    const user =
      await this.userService.findUserByProviderAccountId(providerAccountId);

    if (user) {
      return {
        status: 200,
        data: user,
      };
    } else {
      return {
        status: 400,
        data: "실패",
      };
    }
  }
}
