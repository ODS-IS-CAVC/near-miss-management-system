import { Pipe, PipeTransform } from "@angular/core";
import * as bytes from "bytes";

/** ファイル単位変換パイプ */
@Pipe({ name: "byteFormat" })
export class ByteFormatPipe implements PipeTransform {
  /**
   * @param size ファイルサイズ
   * @return ファイルサイズの単位
   */
  transform(size: number): string {
    return bytes.format(size);
  }
}
