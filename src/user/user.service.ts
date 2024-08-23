import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CreateUserRequestDto } from "./dto/create-user.request.dto";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserRequestDto: CreateUserRequestDto) {
    return await this.userRepository.createUser(createUserRequestDto);
  }

  async isUserByProviderAccountId(providerAccountId: string) {
    return await this.userRepository.findUserByProviderAccountId(
      providerAccountId,
    );
  }

  async findUserByProviderAccountId(providerAccountId: string) {
    return await this.userRepository.findUserByProviderAccountId(
      providerAccountId,
    );
  }

  async updateRefreshToken(providerAccountId: string, refreshToken: string) {
    return await this.userRepository.updateRefreshToken(
      providerAccountId,
      refreshToken,
    );
  }
}
