import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CoordinateInfo } from "./coordinate-info";
import { AttributeInfo } from "./attribute-info";
import { IsUUID, IsOptional, MaxLength, IsISO8601, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { MAX_LENGTH_UUID, MAX_LENGTH_PARTIAL_MATCH_WORDS, MIN_LENGTH_OPTIONAL } from "../../../consts/validate";

/** ヒヤリハット抽出属性設定APIリクエスト */
export class UpdateNearmissInfoBodyDTO {
  /** データID */
  @ApiProperty({
    description: "データID",
    format: "uuid",
    minLength: MAX_LENGTH_UUID,
    maxLength: MAX_LENGTH_UUID,
    example: "78aa302c-1600-44b3-a331-e4659c0b28a1",
  })
  @IsUUID()
  id: string;

  /** 分類 */
  @ApiPropertyOptional({
    description: "分類",
    example: "合流",
    minLength: MIN_LENGTH_OPTIONAL,
    maxLength: MAX_LENGTH_PARTIAL_MATCH_WORDS,
  })
  @IsOptional()
  @MaxLength(MAX_LENGTH_PARTIAL_MATCH_WORDS)
  category?: string;

  /** 発生時刻 (ISO 8601形式) */
  @ApiPropertyOptional({
    description: "発生時刻 (ISO 8601形式)",
    example: "2024-07-10T09:37:58.372Z",
  })
  @IsOptional()
  @IsISO8601()
  timestamp?: string;

  /** 発生地点 */
  @ApiPropertyOptional({
    description: "発生地点",
    type: () => [CoordinateInfo],
  })
  @Type(() => CoordinateInfo)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  coordinates?: CoordinateInfo[];

  /** ヒヤリハット属性リスト。発生位置、発生時刻、分類等以外の属性を保持する。 */
  @ApiPropertyOptional({
    description: "ヒヤリハット属性リスト。発生位置、発生時刻、分類等以外の属性を保持する。",
    type: () => [AttributeInfo],
  })
  @Type(() => AttributeInfo)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  attributes?: AttributeInfo[];
}
