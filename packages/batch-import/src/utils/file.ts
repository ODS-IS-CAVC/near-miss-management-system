/**
 * ファイル拡張子を取得
 * @param objectKey s3から取得したオブジェクトキー情報
 * @returns ファイル拡張子
 */
export const getFileExtension = (objectKey: string): string => {
  const fileName = objectKey.substring(objectKey.lastIndexOf("/") + 1);
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop() : "";
};
