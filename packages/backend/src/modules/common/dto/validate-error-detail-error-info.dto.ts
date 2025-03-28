import { ApiProperty } from "@nestjs/swagger";

/** APIバリデーションチェックエラーレスポンスフィールド.エラー詳細 */
export class ValidateErrorDetailErrorInfo {
  /** 制約識別子 */
  @ApiProperty({
    description: "制約識別子",
    example: "MIN_LENGTH",
  })
  constraint: string;

  /** 制約違反メッセージ */
  @ApiProperty({
    description: "制約違反メッセージ",
    example: "3文字以上で入力してください",
  })
  message: string;
}
