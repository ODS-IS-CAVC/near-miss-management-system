import { VALIDATION_FAILED_CODE } from "../consts/exception";
import { ValidateErrorDetailFieldInfo } from "../modules/common/dto/validate-error-detail-field-info.dto";
import { ValidateErrorResponseDTO } from "../modules/common/dto/validate-error-response.dto";
import { extractErrorMessages } from "./../utils/extract-error-messages";
import { BadRequestException, ValidationError } from "@nestjs/common";
import { LogService } from "@nearmiss-manager/log/log.service";

/**
 * バリデーションチェックエラーレスポンスを作成
 * @param errors バリデーションエラー
 * @throws BadRequestException(ValidateErrorResponseDTO)
 */
export const validationFailedExceptionFactory = (errors: ValidationError[], log: LogService): ValidateErrorResponseDTO => {
  const messages: ValidateErrorDetailFieldInfo[] = extractErrorMessages(errors);
  const errorResponse = {
    code: VALIDATION_FAILED_CODE,
    detail: messages,
  };
  log.logError(new Error(errorResponse.code), JSON.stringify(errorResponse));
  throw new BadRequestException(errorResponse);
};
