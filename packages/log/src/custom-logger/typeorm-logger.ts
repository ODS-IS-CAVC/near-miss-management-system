import { Logger as TypeOrmLogger } from "typeorm";
import { LogService } from "../log.service";
import { Injectable } from "@nestjs/common";

/** カスタムTypeORMロガー */
@Injectable()
export class CustomTypeOrmLogger implements TypeOrmLogger {
  /**
   * @param logService ログサービス
   */
  constructor(private readonly logService: LogService) {
    this.logService.setContext(CustomTypeOrmLogger.name);
  }

  /**
   * クエリ用ログ
   * @param query クエリ
   * @param parameters パラメータ
   */
  logQuery(query: string, parameters?: any[]) {
    const parametersMessage = parameters ? "-- Parameters:" + JSON.stringify(parameters) : "";
    const message = `Query : ${query} ${parametersMessage}`;
    this.logService.logInfo(message);
  }

  /**
   * エラークエリ用ログ
   * @param error エラー情報
   * @param query クエリ
   * @param parameters パラメータ
   */
  logQueryError(error: string, query: string, parameters?: any[]) {
    const errorObj = new Error(error);
    const parametersMessage = parameters ? "-- Parameters:" + JSON.stringify(parameters) : "";
    const message = `Query failed: ${query} ${parametersMessage}`;
    this.logService.logError(errorObj, message);
  }

  /**
   * スロークエリ用ログ
   * @param time 時間
   * @param query クエリ
   * @param parameters パラメータ
   */
  logQuerySlow(time: number, query: string, parameters?: any[]) {
    const parametersMessage = parameters ? "-- Parameters:" + JSON.stringify(parameters) : "";
    const message = `Slow query detected: ${query} (${time}ms) ${parametersMessage}`;
    this.logService.logInfo(message);
  }

  /**
   * スキーマ構築用ログ
   * @param message メッセージ
   */
  logSchemaBuild(message: string) {
    this.logService.logInfo(`Schema build: ${message}`);
  }

  /**
   * マイグレーション用ログ
   * @param message メッセージ
   */
  logMigration(message: string) {
    this.logService.logInfo(`Migration: ${message}`);
  }

  /**
   * ログ
   * @param level ログレベル
   * @param message メッセージ
   */
  log(level: "log" | "info" | "warn" | "error", message: any) {
    if (level === "log" || level === "info") {
      this.logService.logInfo(message);
    } else if (level === "error") {
      const errorObj = new Error(message);
      this.logService.logError(errorObj, message);
    } else if (level === "warn") {
      this.logService.logInfo(`Warning: ${message}`);
    }
  }
}
