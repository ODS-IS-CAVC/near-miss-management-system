import { Injectable, Scope } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";

/** 共通ログサービスクラス */
@Injectable({ scope: Scope.TRANSIENT })
export class LogService extends PinoLogger {
  /**
   * 共通ロギング関数
   * @param level ログレベル
   * @param message ログメッセージ
   * @param [fields={}] ログ情報(フィールド)
   */
  private logWithCommonFields(level: "info" | "error", message: string, fields: Record<string, any> = {}) {
    const commonFields = { ...fields };
    this.logger[level](commonFields, message);
  }

  /**
   * ファイル名・ライン数・関数名作成
   * @returns  ファイル名・ライン数・関数名
   */
  private logAddFileInfo() {
    const err = new Error();
    const errstack = err.stack?.split("\n")[3].trim();

    const match = errstack.match(/(?:\()?(\/[^:]+):(\d+):\d+(?:\))?/);
    if (!match) {
      throw new Error("ログ出力でのスタック情報解析に失敗しました。");
    }
    const filename = match[1];
    const lineno = match[2];

    const functionNameMatch = errstack.match(/at\s+(.*)\s+\(/);
    const functionName = functionNameMatch ? functionNameMatch[1] : "anonymous";

    return { filename, lineno, functionName };
  }

  /**
   * ログレベル info用関数
   * @param message ログメッセージ
   */
  logInfo(message: string) {
    const { filename, lineno, functionName } = this.logAddFileInfo();

    this.logWithCommonFields("info", message, { filename: filename, functionName: functionName, lineno: lineno, module: this.context });
  }

  /**
   * ログレベル error用関数
   * @param error エラー情報
   * @param message ログメッセージ
   */
  logError(error: Error, message: string) {
    const { filename, lineno, functionName } = this.logAddFileInfo();
    const stack = error.stack;

    this.logWithCommonFields("error", message, {
      filename: filename,
      functionName: functionName,
      lineno: lineno,
      module: this.context,
      stack: stack,
    });
  }

  /** デフォルトのメソッドをオーバーライドして非公開にして無効 */
  public trace(message: any, ...optionalParams: any[]): void {
    // メソッドは何もしないように意図的に実装
  }

  /** デフォルトのメソッドをオーバーライドして非公開にして無効 */
  public debug(message: any, ...optionalParams: any[]): void {
    // メソッドは何もしないように意図的に実装
  }

  /** デフォルトのメソッドをオーバーライドして非公開にして無効 */
  public info(message: any, ...optionalParams: any[]): void {
    // メソッドは何もしないように意図的に実装
  }

  /** デフォルトのメソッドをオーバーライドして非公開にして無効 */
  public warn(message: any, ...optionalParams: any[]): void {
    // メソッドは何もしないように意図的に実装
  }

  /** デフォルトのメソッドをオーバーライドして非公開にして無効 */
  public error(message: any, ...optionalParams: any[]): void {
    // メソッドは何もしないように意図的に実装
  }

  /** デフォルトのメソッドをオーバーライドして非公開にして無効 */
  public fatal(message: any, ...optionalParams: any[]): void {
    // メソッドは何もしないように意図的に実装
  }
}
