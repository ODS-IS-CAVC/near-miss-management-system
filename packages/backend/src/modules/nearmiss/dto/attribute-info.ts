import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

/**
 * ヒヤリハット情報一覧データモデル取得APIレスポンス.ヒヤリハット情報.発生地点<br>
 * ヒヤリハット抽出属性設定APIリクエスト.発生地点
 */
export class AttributeInfo {
  /** key */
  @ApiProperty({
    example: "someAttributeName",
  })
  @IsNotEmpty()
  @Expose()
  key: string;

  /** value */
  @ApiProperty({
    example: "someAttributeValue",
  })
  @IsNotEmpty()
  @Expose()
  value: string;
}
