/**
 * 座標の入力パターン<br>
 * ・カンマ区切り前後は数値入力必須<br>
 * ・緯度経度の入力が'±'のみもしくは'.'終わりは不可<br>
 * ・緯度 → '±'+(整数部1~2桁の数値)+'.'+(小数部14桁までの数値)<br>
 * ・経度 → '±'+(整数部1~3桁の数値)+'.'+(小数部14桁までの数値)
 */
export const COORDINATE_REGEX: string = "^-?\\d{1,2}(\\.\\d{1,14})?,\\s*-?\\d{1,3}(\\.\\d{1,14})?$";
/** データIDの最大入力文字数 */
export const MAX_LENGTH_UUID: number = 36;
/** 情報、要約の最大入力文字数 */
export const MAX_LENGTH_PARTIAL_MATCH_WORDS: number = 4096;
