/**
 * 処理実行開始・終了ログ
 * @param taskType Start or End
 * @param taskName 処理名
 */
export const generateExecutionLogMessage = (taskType: string, taskName: string) => `${taskType} ${taskName}`;

/**
 * データベース処理 開始・終了ログ
 * @param taskType Start or End
 * @param operation 操作
 * @param tableName テーブル名
 */
export const generateDatabaseLogMessage = (taskType: string, operation: string, tableName?: string) =>
  `${taskType} ${operation} ${tableName ?? ""}`;
