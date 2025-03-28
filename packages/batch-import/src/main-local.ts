import { NestFactory } from "@nestjs/core";
import { ImportModule } from "./modules/import/import.module";

async function bootstrap() {
  const app = await NestFactory.create(ImportModule);

  app.setGlobalPrefix("batch/v1");

  await app.listen(4000);
}
bootstrap();
