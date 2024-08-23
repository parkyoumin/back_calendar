import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "*",
    credentials: true,
    exposedHeaders: ["Access-Token", "Refresh-Token-Invalid", "Role"],
  });
  await app.listen(3001);
}
bootstrap();
