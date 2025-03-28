/**
 * 検索ワードのみを抽出
 * @param column ヒヤリハット情報一覧データモデル取得APIリクエスト（name, category, summary)
 * @return 検索ワードの配列
 */
export const extractSearchWords = (column: string): string[] => {
  return column
    .replace(/　/g, " ")
    .split(" ")
    .filter((word) => word);
};

/**
 * 特殊文字をエスケープ
 * @param column ヒヤリハット情報一覧データモデル取得APIリクエスト（name, category, summary)
 * @return エスケープされた検索ワード
 */
export const escapeSpecialWord = (column: string) => {
  return column
    .replace(/\\/g, "\\\\") // バックスラッシュを二重にする
    .replace(/_/g, "\\_") // アンダースコアをエスケープ
    .replace(/%/g, "\\%"); // パーセント記号をエスケープ
};
