import { ApiProperty } from "@nestjs/swagger";
import { ValidateErrorDetailErrorInfo } from "./validate-error-detail-error-info.dto";

/** APIバリデーションチェックエラーレスポンスフィールド */
export class ValidateErrorDetailFieldInfo {
  /** フィールド名 */
  @ApiProperty({
    description: "フィールド名",
    example: "name",
  })
  field: string;

  /** エラー情報 */
  @ApiProperty({
    description: "エラー情報",
    type: () => [ValidateErrorDetailErrorInfo],
  })
  errors: ValidateErrorDetailErrorInfo[];
}
