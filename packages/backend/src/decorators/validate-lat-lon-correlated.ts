import { registerDecorator, ValidationArguments } from "class-validator";

/** 座標（lat0,lon0,lat1,lon1）がどれか一つでも設定されている場合に、どれか一つでも欠けている場合エラーとするカスタムデコレーター */
export function IsLatLonCorrelated() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isLatLonCorrelated",
      target: object.constructor,
      propertyName: propertyName,
      constraints: ["lat0", "lon0", "lat1", "lon1"],
      validator: {
        validate(_value: any, args: ValidationArguments): boolean {
          const [lat0Prop, lon0Prop, lat1Prop, lon1Prop] = args.constraints;
          const latLonProps = [lat0Prop, lon0Prop, lat1Prop, lon1Prop];
          const undefinedProps = latLonProps.filter((prop) => (args.object as any)[prop] === undefined);
          if (undefinedProps.length !== 0) {
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const [lat0Prop, lon0Prop, lat1Prop, lon1Prop] = args.constraints;
          const latLonProps = [lat0Prop, lon0Prop, lat1Prop, lon1Prop];
          const undefinedProps = latLonProps.filter((prop) => (args.object as any)[prop] === undefined);

          if (undefinedProps.length !== 0) {
            return `${undefinedProps.join(", ")} is required`;
          }
        },
      },
    });
  };
}
