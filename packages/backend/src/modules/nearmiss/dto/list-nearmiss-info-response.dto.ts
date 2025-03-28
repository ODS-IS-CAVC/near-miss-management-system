import { ApiProperty } from "@nestjs/swagger";
import { NearmissInfo } from "./nearmiss-info";

/** ヒヤリハット情報一覧データモデル取得APIレスポンス */
export class ListNearmissInfoResponseDTO {
  /** データモデルタイプ(test1固定) */
  @ApiProperty({
    description: "データモデルタイプ(test1固定)",
    example: "test1",
  })
  dataModelType: string;

  /** ヒヤリハット情報リスト */
  @ApiProperty({
    description: "ヒヤリハット情報リスト",
    type: () => [NearmissInfo],
  })
  attribute: NearmissInfo[];
}
