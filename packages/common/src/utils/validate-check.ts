import { validate as validateUUID } from "uuid";

/**
 * uuid形式のチェック
 * @param checkStr チェック対象文字列
 * @returns true:uuid形式である場合
 */
export const isValidUuid = (checkStr: string): boolean => {
  return validateUUID(checkStr);
};
