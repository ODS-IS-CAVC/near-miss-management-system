import { parseStringPromise } from "xml2js";
import * as xmlbuilder from "xmlbuilder";

/**
 * xmlデータをObject配列に変換
 * @param rootName 親タグの名前
 * @param xml　xmlデータ
 * @returns 変換後のobject配列
 */
export const parseXmlToObjectArray = async (rootName: string, xml: string | undefined | null): Promise<object[]> => {
  if (!xml || xml === "") {
    return Promise.resolve([]);
  }
  const result = await parseStringPromise(xml, {
    explicitArray: false,
    mergeAttrs: true,
  });

  const rootElement = result[rootName];
  let childrenArray = null;
  for (const key in rootElement) {
    if (Array.isArray(rootElement[key])) {
      childrenArray = rootElement[key];
      break;
    }
  }
  if (childrenArray) {
    return childrenArray;
  } else {
    const childElement = rootElement[rootName.slice(0, -1)];
    return [childElement];
  }
};

/**
 * Object配列をxmlデータに変換
 * @param rootName 親タグの名前
 * @param childrenName　子タグの名前
 * @param objectArr object配列
 * @return 変換後のxmlデータ
 */
export const parseObjectArrayToXml = (rootName: string, childrenName: string, objectArr: any): string => {
  if (!objectArr || (Array.isArray(objectArr) && objectArr.length === 0)) {
    return null;
  }
  const root = xmlbuilder.create(rootName);
  objectArr.forEach((object) => {
    const fileElement = root.ele(childrenName);
    for (const key in object) {
      // 値がnull, undefined, 空文字の場合はタグ事作成しない
      if (object[key] != null && object[key] !== "") {
        fileElement.ele(key, object[key].toString());
      }
    }
  });
  const xml = root.end({ pretty: true });
  return xml;
};
