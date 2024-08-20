import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async signUp(createUserDto: CreateUserDto) {
    const { email, name } = createUserDto;

    return await this.prisma.user.create({
      data: {
        email,
        name,
      },
    });
  }

  async findUser(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
