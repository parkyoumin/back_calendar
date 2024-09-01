import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { JwtAuthGuard } from "./jwt/jwt.guard";
import { UserService } from "src/user/user.service";
import { UserRepository } from "src/user/user.repository";
import { GoogleStrategy } from "./oauth/google.strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({ global: true }),
    PassportModule.register({ defaultStrategy: "google" }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    UserService,
    UserRepository,
    GoogleStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
