import { HttpStatus } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Callback, Context, Handler } from "aws-lambda";
import { ImportModule } from "./modules/import/import.module";
import { ImportService } from "./modules/import/import.service";

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  const batchContext = await NestFactory.createApplicationContext(ImportModule);
  const batchService = batchContext.get(ImportService);

  // S3イベントを処理するロジック
  const response = await batchService.handleS3Event(event);
  await batchContext.close();

  return {
    body: response,
    statusCode: HttpStatus.OK,
  };
};
