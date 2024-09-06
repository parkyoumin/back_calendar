import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUser } from "src/types/user.type";

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUser: CreateUser) {
    const { providerAccountId, email, name } = createUser;

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

  async deleteUser(providerAccountId: string) {
    return await this.prisma.user.delete({
      where: {
        providerAccountId,
      },
    });
  }
}
