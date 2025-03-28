import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { LogService } from "./log.service";
import { Request, Response } from "express";
import { Context } from "aws-lambda";

import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);

// 環境変数からタイムゾーンを取得、なければデフォルトのAsia/Tokyoを使用
const DEFAULT_TIMEZONE = "Asia/Tokyo";
const TIMEZONE = process.env.TIMEZONE || DEFAULT_TIMEZONE;

/** 共通ログモジュール */
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        // Timestampの出力結果のフォーマットをISO8601の形式に設定
        timestamp: () => `,"timestamp":"${dayjs().tz(TIMEZONE).format("YYYY-MM-DDTHH:mm:ss.SSSZ")}"`,
        // HTTPリクエストの自動ロギングを無効化
        autoLogging: false,
        // requestId(関数呼び出しの一意のリクエストID)を追加
        customProps: (req: Request & { context?: Context }, res: Response) => {
          const requestId = req.headers["x-amzn-trace-id"] || "";
          return { requestId };
        },
        // id(データID(uuid))を追加
        serializers: {
          req: (req) => {
            return {
              id: req.raw.body.id || "",
            };
          },
          res: (res) => {
            // `res`オブジェクトをカスタマイズ。ここでは空オブジェクトにして実質的に除外
          },
        },
        // base: nullに設定すると、デフォルトで含まれるすべてのプロパティ（pidやhostnameなど）を除外
        base: {},
        // levelの表示を”error”や"info"などの文字列で表示
        formatters: {
          level(label) {
            return { level: label };
          },
        },
      },
    }),
  ],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
