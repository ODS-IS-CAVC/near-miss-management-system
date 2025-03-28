import { ApiProperty } from "@nestjs/swagger";
import { ValidateErrorDetailFieldInfo } from "./validate-error-detail-field-info.dto";

/** APIバリデーションチェックエラーレスポンス */
export class ValidateErrorResponseDTO {
  /** エラーコード */
  @ApiProperty({
    description: "エラーコード",
    example: "VALIDATION_FAILED",
  })
  code: string;

  /** フィールド情報 */
  @ApiProperty({
    description: "フィールド情報",
    type: () => [ValidateErrorDetailFieldInfo],
  })
  detail: ValidateErrorDetailFieldInfo[];
}
