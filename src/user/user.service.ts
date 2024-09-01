import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CreateUserRequestDto } from "./dto/create-user.request.dto";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserRequestDto: CreateUserRequestDto) {
    const user = await this.userRepository.createUser(createUserRequestDto);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async isUserByProviderAccountId(providerAccountId: string) {
    const user =
      await this.userRepository.findUserByProviderAccountId(providerAccountId);

    if (user) {
      return true;
    } else {
      return false;
    }
  }

  async findUserByProviderAccountId(providerAccountId: string) {
    const user =
      await this.userRepository.findUserByProviderAccountId(providerAccountId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async updateRefreshToken(providerAccountId: string, refreshToken: string) {
    const user = await this.userRepository.updateRefreshToken(
      providerAccountId,
      refreshToken,
    );

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }
}
