import { ApiProperty } from "@nestjs/swagger";

/** 分類情報一覧取得APIレスポンス.分類情報 */
export class CategoryInfo {
  /** 分類名 */
  @ApiProperty({
    description: "分類名",
    example: "分類A",
  })
  label: string;
}
