import { NestFactory } from "@nestjs/core";
import serverlessExpress from "@codegenie/serverless-express";
import { AppModule } from "./app.module";
import { Callback, Context, Handler } from "aws-lambda";
import { ValidationPipe } from "@nestjs/common";
import { LogService } from "@nearmiss-manager/log/log.service";
import { validationFailedExceptionFactory } from "./exceptions/exception-factory";

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [process.env.FRONTEND_URL],
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
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
