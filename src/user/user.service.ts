import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUser(email: string) {
    const userFound = await this.userRepository.findUser(email);

    if (userFound) {
      return { status: 200, data: true };
    } else {
      return { status: 200, data: false };
    }
  }

  async signUp(createUserDto: CreateUserDto) {
    const response = await this.userRepository.signUp(createUserDto);

    return {
      status: 200,
      data: response,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
