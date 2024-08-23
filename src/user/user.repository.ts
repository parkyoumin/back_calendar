import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserRequestDto } from "./dto/create-user.request.dto";

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserRequestDto: CreateUserRequestDto) {
    const { providerAccountId, email, name } = createUserRequestDto;

    return await this.prisma.user.create({
      data: {
        providerAccountId,
        email,
        name,
      },
    });
  }

  async findUserByProviderAccountId(providerAccountId: string) {
    return await this.prisma.user.findUnique({
      where: {
        providerAccountId,
      },
    });
  }

  async updateRefreshToken(providerAccountId: string, refreshToken) {
    return await this.prisma.user.update({
      data: {
        refreshToken,
      },
      where: {
        providerAccountId,
      },
    });
  }
}
