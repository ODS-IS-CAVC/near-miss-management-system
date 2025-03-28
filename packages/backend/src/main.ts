import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { validationFailedExceptionFactory } from "./exceptions/exception-factory";
import { LogService } from "@nearmiss-manager/log/log.service";

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: "http://localhost:4210",
      methods: "*",
      credentials: true,
    },
  });
  app.setGlobalPrefix("api/v1");

  const logService = await app.resolve<LogService>(LogService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => validationFailedExceptionFactory(errors, logService),
    }),
  );

  const config = new DocumentBuilder().setTitle("C-3-2 ヒヤリハット管理システムAPI").setDescription("").setVersion("0.0.1").build();
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });
  SwaggerModule.setup("openapi", app, document);

  await app.listen(3000);

  // ホットリロード用の設定
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
