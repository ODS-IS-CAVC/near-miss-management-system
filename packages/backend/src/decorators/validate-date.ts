import { IsISO8601, registerDecorator, ValidationArguments } from "class-validator";

/**
 * toがfromよりも前の日時を設定されている場合にエラーとするカスタムデコレーター
 * @param toProp 発生日時(上限値（排他）)
 */
export function IsBeforeEqualDate(toProp: string) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isBeforeEqualDate",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [toProp],
      validator: {
        validate(value: any, args: ValidationArguments): boolean {
          const [toProp] = args.constraints;
          const from = value;
          const to = (args.object as any)[toProp];
          // 両方の値がある場合にのみチェックを行う
          if (from && to && IsISO8601(from) && IsISO8601(to)) {
            return new Date(from) <= new Date(to);
          }
          return true;
        },
        defaultMessage() {
          return `${propertyName} should be before or equal ${toProp}`;
        },
      },
    });
  };
}
