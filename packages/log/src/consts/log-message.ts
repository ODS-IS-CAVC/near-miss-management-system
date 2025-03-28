/** ログ出力：実行開始・終了 */
export const LOG_TASK_TYPE = {
  START: "Start",
  END: "End",
};

/** ログ出力：データベース操作 */
export const LOG_DATABASE_OPERATION_TYPE = {
  INSERT: "Insert",
  SELECT: "Select",
  UPDATE: "Update",
  TRANSACTION: "Transaction",
};

/** ログ出力：テーブル */
export const LOG_TABLE = {
  NEARMISS_INFO: "nearmiss_info",
};

/** ログ出力：API機能名 */
export const LOG_API = {
  NEARMISS_INFO_LIST: "nearmissinfolist-API",
  ATTRIBUTES: "attributes-API",
  CATEGORY_LIST: "categorylist-API",
};

/** ログ出力：バッチ機能名 */
export const LOG_BATCH = {
  IMPORT: "import-Batch",
};

/** ログ出力：外部API機能名 */
export const LOG_EXTERNAL_API = {
  S3_LIST_OBJECTS_V2: "ListObjectsV2Command-API",
  S3_DELETE_OBJECTS: "DeleteObjectCommand-API",
  EXTRACT_ATTRIBUTES: "extractAttributes-API",
};
