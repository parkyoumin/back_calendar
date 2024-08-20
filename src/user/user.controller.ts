import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 유저 검사
  @Get()
  findUser(@Query() query: { email: string }) {
    const { email } = query;
    return this.userService.findUser(email);
  }

  // 회원가입
  @Post()
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }

  // 탈퇴
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
}
