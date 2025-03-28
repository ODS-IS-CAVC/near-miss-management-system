import { ValidationError } from "@nestjs/common";
import { ValidateErrorDetailErrorInfo } from "../modules/common/dto/validate-error-detail-error-info.dto";
import { ValidateErrorDetailFieldInfo } from "../modules/common/dto/validate-error-detail-field-info.dto";

/**
 * バリデーションチェックエラー情報からレスポンスに設定する情報を抽出する
 * @param errors バリデーションエラー
 * @param parent オブジェクト配列の親情報
 * @return ValidateErrorDetailFieldInfo[]
 */
export const extractErrorMessages = (errors: ValidationError[], parent?: string): ValidateErrorDetailFieldInfo[] =>
  errors.flatMap((e) => {
    const field = parent ? `${parent}.${e.property}` : e.property;
    const isParentError = !(e.children && e.children.length);
    if (isParentError) {
      const constraints =
        e.constraints && Object.keys(e.constraints).length > 0
          ? Object.keys(e.constraints).map(
              (key) =>
                ({
                  constraint: key,
                  message: e.constraints[key],
                }) as ValidateErrorDetailErrorInfo,
            )
          : [];
      return {
        field: field,
        errors: constraints,
      };
    } else {
      return extractErrorMessages(e.children, field);
    }
  });
