import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsLatitude, IsLongitude, IsOptional } from "class-validator";
import { Expose, Transform } from "class-transformer";

/**
 * ヒヤリハット情報一覧データモデル取得APIレスポンス.ヒヤリハット情報.発生地点<br>
 * ヒヤリハット抽出属性設定APIリクエスト.発生地点
 */
export class CoordinateInfo {
  /** 緯度[degree] */
  @ApiProperty({
    description: "緯度[degree]",
    example: 35.66104767541138,
    format: "double",
  })
  @IsNotEmpty()
  @IsLatitude()
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  lat: number;

  /** 経度[degree] */
  @ApiProperty({
    description: "経度[degree]",
    example: 139.70993603470313,
    format: "double",
  })
  @IsNotEmpty()
  @IsLongitude()
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  lon: number;

  /** 標高[m] */
  @ApiPropertyOptional({
    description: "標高[m]",
    example: 34.4,
    format: "double",
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  @Transform(({ value }) => (value != null ? parseFloat(value) : undefined))
  alt?: number;
}
