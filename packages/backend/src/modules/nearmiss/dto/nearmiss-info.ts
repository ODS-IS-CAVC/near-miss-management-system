import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CoordinateInfo } from "./coordinate-info";
import { AttributeInfo } from "./attribute-info";
import { FileInfo } from "./file-info";
import { Expose, Transform, Type } from "class-transformer";

/** ヒヤリハット情報一覧データモデル取得APIレスポンス.ヒヤリハット情報 */
export class NearmissInfo {
  /** データID */
  @ApiProperty({
    description: "データID",
    format: "uuid",
  })
  @Expose()
  id: string;

  /** 共有用データフォルダURI */
  @ApiProperty({
    description: "共有用データフォルダURI",
    example: "https://hhBucketName.s3.ap-northeast-1.amazonaws.com",
  })
  @Expose()
  uri: string;

  /** 名称 */
  @ApiPropertyOptional({
    description: "名称",
    example: "ヒヤリハット情報A",
  })
  @Expose()
  name?: string;

  /** 分類 */
  @ApiPropertyOptional({
    description: "分類",
    example: "合流",
  })
  @Expose()
  category?: string;

  /** 要約 */
  @ApiPropertyOptional({
    description: "要約",
    example: "ヒヤリハット情報要約をここに記述する。",
  })
  @Expose()
  summary?: string;

  /** 発生時刻 (ISO 8601形式) */
  @ApiPropertyOptional({
    description: "発生時刻 (ISO 8601形式)",
    example: "2024-07-10T09:37:58.372Z",
  })
  @Expose()
  @Transform(({ value }) => (value instanceof Date ? value.toISOString() : value))
  timestamp?: string;

  /** 発生地点 */
  @ApiPropertyOptional({
    description: "発生地点",
    type: () => [CoordinateInfo],
  })
  @Expose()
  @Type(() => CoordinateInfo)
  coordinates?: CoordinateInfo[];

  /** ヒヤリハット属性リスト。発生位置、発生時刻、分類等以外の属性を保持する。 */
  @ApiPropertyOptional({
    description: "ヒヤリハット属性リスト。発生位置、発生時刻、分類等以外の属性を保持する。",
    type: () => [AttributeInfo],
  })
  @Expose()
  @Type(() => AttributeInfo)
  attributes?: AttributeInfo[];

  /** ファイル情報 */
  @ApiProperty({
    description: "ファイル情報",
    type: () => [FileInfo],
  })
  @Expose()
  @Type(() => FileInfo)
  files: FileInfo[];
}
