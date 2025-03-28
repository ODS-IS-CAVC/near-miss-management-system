/** csvダウンロードファイル名の固定文字列 */
export const CSV_DOWNLOAD_FILENAME_PREFIX: string = "ヒヤリハット属性情報検索結果";

/** 画面表示メッセージ */
export const Messages = {
  /**
   * 分類選択フォームで初期表示メッセージを返却する関数
   * @returns メッセージ
   */
  CATEGORY_PLACEHOLDER: () => "分類を選択してください",
  /**
   * 分類選択フォームで取得0件(失敗)もしくは検索条件不一致の場合のメッセージを返却する関数
   * @returns メッセージ
   */
  CATEGORY_EMPTY: () => "分類が見つかりませんでした",
  /**
   * 分類選択フォームで指定項目数以上選択されている場合のメッセージを返却する関数
   * @param length 選択項目数
   * @returns メッセージ
   */
  CATEGORY_MULTIPLE_SELECT: (length: number) => `${length}項目 選択済み`,

  /**
   * 文字数超過時のバリデーションエラーメッセージを返却する関数
   * @param length 最大入力文字数
   * @returns メッセージ
   */
  VALIDATION_MAX_LENGTH: (length: number) => `入力文字が上限(${length}文字)を超えています。`,
  /**
   * 文字が正規表現と不一致時のメッセージを返却する関数
   * @returns メッセージ
   */
  VALIDATION_INVALID_COORDINATE: () => "入力値が不正です。",
  /**
   * フォーム未入力時のメッセージを返却する関数
   * @param label 対象項目
   * @returns メッセージ
   */
  VALIDATION_REQUIRED: (label: string) => `${label}が未入力です。`,

  /**
   * CSVダウンロード成功メッセージを返却する関数
   * @returns メッセージ
   */
  CSV_DOWNLOAD_SUCCESS_MESSAGE: () => "検索結果CSVのダウンロードに成功しました。",
  /**
   * CSVダウンロード失敗メッセージを返却する関数
   * @returns メッセージ
   */
  CSV_DOWNLOAD_ERROR_MESSAGE: () => "検索結果CSVのダウンロードに失敗しました。",

  /**
   * 分類情報一覧取得APIからのデータ取得失敗メッセージを返却する関数
   * @returns メッセージ
   */
  API_ERROR_LIST_CATEGORY_RESPONSE_MESSAGE: () => "分類一覧の取得に失敗しました。",
  /**
   * ヒヤリハット情報一覧データモデル取得APIからのデータ取得失敗メッセージを返却する関数
   * @returns メッセージ
   */
  API_ERROR_LISTNEARMISSINFO_RESPONSE_MESSAGE: () => "検索結果の取得に失敗しました。",

  /**
   * 検索結果が0件もしくはAPIエラー発生時のメッセージを返却する関数(初期表示は除く)
   * @returns メッセージ
   */
  NEARMISSINFO_EMPTY_MESSAGE: () => "検索条件に合致するヒヤリハットが見つかりませんでした。",
};
