import { NearmissInfo } from "../../generated/model/nearmissInfo";

/**
 * 検索結果の型定義<br>
 * 便宜上APIからNearmissInfoを継承し、noを追加
 */
export interface NearmissInfoType extends NearmissInfo {
  /** 表示行番号 */
  no: number;
}
