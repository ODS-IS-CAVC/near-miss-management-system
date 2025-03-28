import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";

/** ヒヤリハット情報一覧データモデル取得APIレスポンス.ヒヤリハット情報.ファイル */
export class FileInfo {
  /** ファイル種別(拡張子) */
  @ApiProperty({
    description: "ファイル種別(拡張子)",
    example: "jdr",
  })
  @Expose()
  type: string;

  /** ファイルサイズ[bytes] */
  @ApiProperty({
    description: "ファイルサイズ[bytes]",
    example: 12033065,
  })
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  size: number;

  /** ファイルURI */
  @ApiProperty({
    description: "ファイルURI",
    example: "s3://hhBucketName/uuidxxx/hhObjectName.jdr",
  })
  @Expose()
  uri: string;
}
