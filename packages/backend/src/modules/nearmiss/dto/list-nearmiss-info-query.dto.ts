import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, MaxLength, IsLatitude, IsLongitude, IsISO8601 } from "class-validator";
import { IsBeforeEqualDate } from "../../../decorators/validate-date";
import { IsLatLonCorrelated } from "../../../decorators/validate-lat-lon-correlated";
import { MAX_LENGTH_UUID, MAX_LENGTH_PARTIAL_MATCH_WORDS } from "../../../consts/validate";
import { Type } from "class-transformer";

/** ヒヤリハット情報一覧データモデル取得APIリクエスト */
export class ListNearmissInfoQueryDTO {
  /** データIDフィルター(部分一致) */
  @ApiPropertyOptional({
    description: "データIDフィルター(部分一致)",
    maxLength: MAX_LENGTH_UUID,
    example: "78aa302c-1600-44b3-a331-e4659c0b28a1",
  })
  @IsOptional()
  @MaxLength(MAX_LENGTH_UUID)
  id?: string;

  /** 名称フィルター(部分一致) */
  @ApiPropertyOptional({
    description: "名称フィルター(部分一致)",
    maxLength: MAX_LENGTH_PARTIAL_MATCH_WORDS,
    example: "浜松",
  })
  @IsOptional()
  @MaxLength(MAX_LENGTH_PARTIAL_MATCH_WORDS)
  name?: string;

  /** 分類フィルター(部分一致) */
  @ApiPropertyOptional({
    description: "分類フィルター(部分一致)",
    maxLength: MAX_LENGTH_PARTIAL_MATCH_WORDS,
    example: "cat12",
  })
  @IsOptional()
  @MaxLength(MAX_LENGTH_PARTIAL_MATCH_WORDS)
  category?: string;

  /** 要約フィルター(部分一致) */
  @ApiPropertyOptional({
    description: "要約フィルター(部分一致)",
    maxLength: MAX_LENGTH_PARTIAL_MATCH_WORDS,
    example: "追い越し",
  })
  @IsOptional()
  @MaxLength(MAX_LENGTH_PARTIAL_MATCH_WORDS)
  summary?: string;

  /** 発生時刻フィルター。下限値（包含） */
  @ApiPropertyOptional({
    description: "発生時刻フィルター。下限値（包含）",
    format: "date-time",
    example: "2024-07-10T09:37:58.372Z",
  })
  @IsOptional()
  @IsISO8601()
  @IsBeforeEqualDate("to")
  from?: string;

  /** 発生時刻フィルター。上限値（排他） */
  @ApiPropertyOptional({
    description: "発生時刻フィルター。上限値（排他）",
    format: "date-time",
    example: "2024-07-11T09:37:59.372Z",
  })
  @IsOptional()
  @IsISO8601()
  to?: string;

  /** 発生地点フィルター。下限緯度（包含） */
  @ApiPropertyOptional({
    description: "発生地点フィルター。下限緯度（包含）",
    format: "double",
    example: 35.66104767541138,
  })
  @IsOptional()
  @IsLatitude()
  @IsLatLonCorrelated()
  @Type(() => Number)
  lat0?: number;

  /** 発生地点フィルター。下限経度（包含） */
  @ApiPropertyOptional({
    description: "発生地点フィルター。下限経度（包含）",
    format: "double",
    example: 139.70993603470313,
  })
  @IsOptional()
  @IsLongitude()
  @IsLatLonCorrelated()
  @Type(() => Number)
  lon0?: number;

  /** 発生地点フィルター。上限緯度（包含） */
  @ApiPropertyOptional({
    description: "発生地点フィルター。上限緯度（包含）",
    format: "double",
    example: 35.86104767541138,
  })
  @IsOptional()
  @IsLatitude()
  @IsLatLonCorrelated()
  @Type(() => Number)
  lat1?: number;

  /** 発生地点フィルター。上限経度（包含） */
  @ApiPropertyOptional({
    description: "発生地点フィルター。上限経度（包含）",
    format: "double",
    example: 139.90993603470312,
  })
  @IsOptional()
  @IsLongitude()
  @IsLatLonCorrelated()
  @Type(() => Number)
  lon1?: number;
}
