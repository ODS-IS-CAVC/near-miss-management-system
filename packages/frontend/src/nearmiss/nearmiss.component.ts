import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";
import { PrimeNGConfig, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { NearmissService } from "../../generated/nearmiss/nearmiss.service";
import { CategoryInfo, ListNearmissInfoParams, ListNearmissInfoResponseDTO } from "../../generated/model";
import { NearmissInfoType } from "../interface/nearniss-info.interface";
import { COORDINATE_REGEX, MAX_LENGTH_UUID, MAX_LENGTH_PARTIAL_MATCH_WORDS } from "../consts/validate";
import { CSV_DOWNLOAD_FILENAME_PREFIX, Messages } from "../consts/messages";
import { ListCategoryResponseDTO } from "../../generated/model";

import dayjs from "dayjs";

/** ヘッダー(検索一覧/ダウンロードCSV)の型 */
type ColType = {
  field: string;
  header: string;
  id: string;
  sortable: boolean;
};

/**
 * 座標入力フォームの相関制御のバリデータを返却する関数
 * @returns 座標入力フォームの相関制御のバリデータ
 */
export function checkCoordinatesCorrelation(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const searchForm = formGroup as FormGroup;
    // 入力値の取得
    const startCoordinate = searchForm.get("startCoordinate");
    const endCoordinate = searchForm.get("endCoordinate");

    if (!startCoordinate || !endCoordinate) {
      return null;
    }

    const startCoordinateValue = startCoordinate.value;
    const endCoordinateValue = endCoordinate.value;
    // 両フィールドが空である場合 → エラーなし
    if (!startCoordinateValue && !endCoordinateValue) {
      startCoordinate.setErrors(null);
      endCoordinate.setErrors(null);
      return null;
    }

    // 開始座標が空で終了座標が入力されている場合 → 開始座標の入力欄配下にエラーを表示
    if (!startCoordinateValue && endCoordinateValue) {
      startCoordinate.setErrors({ startCoordinateOtherSpacesError: true });
      startCoordinate.markAsDirty();
      return { startCoordinateOtherSpacesError: true };
    }

    // 開始座標が入力されていて終了座標が空の場合 → 終了座標の入力欄配下にエラーを表示
    if (startCoordinateValue && !endCoordinateValue) {
      endCoordinate.setErrors({ endCoordinateOtherSpacesError: true });
      endCoordinate.markAsDirty();
      return { endCoordinateOtherSpacesError: true };
    }

    // エラーがない場合はnullを返す
    return null;
  };
}

/** ヒヤリハット検索画面コンポーネント */
@Component({
  selector: "app-nearmiss-page",
  templateUrl: "./nearmiss.component.html",
  providers: [NearmissService, MessageService],
})
export class NearmissComponent implements OnInit {
  @ViewChild("dt") dt: Table | undefined;

  title: string = "nearmiss-operation-screen";

  /** 検索入力フォーム */
  searchForm!: FormGroup;
  /** 検索開始日 */
  fromDate?: Date;
  /** 検索終了日 */
  toDate?: Date;
  /** 分類一覧 */
  categories!: ListCategoryResponseDTO["categories"];
  /** 検索値 */
  searchParams: ListNearmissInfoParams = {};

  /** ヘッダー(検索一覧/ダウンロードCSV) */
  cols: ColType[] = [];
  /** 検索結果(ヒヤリハット一覧) */
  listNearmissInfo: NearmissInfoType[] = [];
  /** 発生地点一覧を表示する場合はTrueを指定 */
  openNearmissCoordinateListDialog: boolean = false;
  /** ファイル一覧を表示する場合はTrueを指定 */
  openNearmissFileListDialog: boolean = false;
  /** 発生地点一覧 */
  nearmissCoordinateList: NearmissInfoType["coordinates"] = [];
  /** ファイル一覧 */
  nearmissFileList: NearmissInfoType["files"] = [];
  /** 検索結果が0件もしくはAPIエラー発生時はTrueを指定(初期表示は除く) */
  showNearmissInfoListEmptyMessage: boolean = false;

  /** CSVダウンロードファイル名 */
  csvDownloadFileName: string = "";
  /** 検索一覧でチェックが入っている行のヒヤリハット情報 */
  selectedNearmissInfo: NearmissInfoType[] = [];
  /** 検索一覧でチェックが入っていない場合はTrueを指定 */
  csvDownloadButtonDisabled: boolean = true;

  /** 画面表示メッセージ */
  messages = Messages;
  /** 情報入力フォームの最大入力文字数 */
  maxLengthName = MAX_LENGTH_PARTIAL_MATCH_WORDS;
  /** 要約入力フォームの最大入力文字数 */
  maxLengthSummary = MAX_LENGTH_PARTIAL_MATCH_WORDS;
  /** データID入力フォームの最大入力文字数 */
  maxLengthUuid = MAX_LENGTH_UUID;

  /**
   * @param data NearmissServiceクラス
   * @param primengConfig PrimeNGConfigクラス
   * @param messageService MessageServiceクラス
   */
  constructor(
    private data: NearmissService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;

    // 検索入力フォームの初期値を代入
    this.searchForm = this.getInitialSearchForm();

    // ヘッダー(検索一覧/ダウンロードCSV)
    this.cols = [
      { field: "no", header: "No", id: "header-no", sortable: true },
      { field: "timestamp", header: "発生日時", id: "header-timestamp", sortable: true },
      { field: "name", header: "情報名", id: "header-name", sortable: true },
      { field: "category", header: "分類", id: "header-category", sortable: true },
      { field: "summary", header: "情報要約", id: "header-summary", sortable: true },
      { field: "coordinates", header: "発生地点", id: "header-coordinateList", sortable: false },
      { field: "id", header: "データID", id: "header-id", sortable: true },
      { field: "files", header: "ファイル", id: "header-fileList", sortable: false },
    ];

    // APIからデータ取得(分類一覧)
    this.getListCategory();

    // APIからデータ取得(検索結果)
    this.getListNearmissInfo();
  }

  /**
   * 分類複数選択時におけるメッセージを返却する関数
   * @returns メッセージ
   */
  getSelectedCategoryItemsLabel(): string {
    return this.messages.CATEGORY_MULTIPLE_SELECT(this.searchForm.get("category")?.value.length);
  }

  /** 検索ボタン押下時の処理 */
  onClickSearchButton() {
    // バリデーションエラーが見つかった場合、処理せずに返す
    if (this.searchForm.invalid) {
      return;
    }

    // データ取得が無い場合の画面表示の有効化
    this.showNearmissInfoListEmptyMessage = true;

    // 検索入力値の取得
    const {
      timestamp: { from: searchFromDate, to: searchToDate },
      category: searchCategory,
      coordinates: { startCoordinate: searchStartCoordinate, endCoordinate: searchEndCoordinate },
      name: searchName,
      summary: searchSummary,
      id: searchId,
    } = this.searchForm.getRawValue();

    // 座標入力値の型変換
    const { searchLat0, searchLon0, searchLat1, searchLon1 } = this.parseCoordinates(searchStartCoordinate, searchEndCoordinate);

    // 分類をカンマ区切り文字列に変換
    const serachCategoriesList = searchCategory
      ? searchCategory
          ?.map((category: CategoryInfo) => {
            return category.label;
          })
          .join(",")
      : null;

    // 発生日時をUTCに変換
    const serachFormatedFromDate = searchFromDate ? this.formatedDateUtc(searchFromDate) : null;
    const serachFormatedToDate = searchToDate ? this.formatedDateUtc(searchToDate) : null;

    this.searchParams = this.deleteUnnecessaryProperty({
      id: searchId,
      name: searchName,
      category: serachCategoriesList,
      summary: searchSummary,
      from: serachFormatedFromDate,
      to: serachFormatedToDate,
      lat0: searchLat0,
      lon0: searchLon0,
      lat1: searchLat1,
      lon1: searchLon1,
    });

    // APIからデータ取得(検索結果)
    this.getListNearmissInfo(this.searchParams);
  }

  /** リセットボタン押下時の処理 */
  onClickResetFormButton() {
    // データ取得が無い場合の画面表示の無効化
    this.showNearmissInfoListEmptyMessage = false;

    // 検索欄のフォームを初期化
    this.searchForm = this.getInitialSearchForm();

    // APIからデータ取得(分類一覧)
    this.getListCategory();

    // APIからデータ取得(検索結果)
    this.getListNearmissInfo();
  }

  /**
   * APIにデータを渡すため、発生日時をISO8601の形式に変換する関数
   * @param timestamp 発生日時（開始・終了）
   * @returns ISO8601形式に変換
   */
  formatedDateUtc(timestamp: string) {
    const searchFromDateInUTC = new Date(new Date(timestamp).getTime());
    // カレンダー選択時に秒数がセットされてしまう為、0で上書き
    searchFromDateInUTC.setSeconds(0, 0);
    return searchFromDateInUTC.toISOString();
  }

  /**
   * APIにデータを渡すため、座標をカンマ区切りに分割し、文字列型から数値型へ変換する関数
   * @param startCoordinate 開始座標
   * @param endCoordinate 終了座標
   * @returns 数値変換した緯度および経度
   */
  parseCoordinates(startCoordinate: string, endCoordinate: string) {
    // 文字列の分割
    const splitStartCoordinate = startCoordinate.split(",");
    const splitEndCoordinate = endCoordinate.split(",");

    // 型変換(string → Number)、空の場合はnull
    const searchLat0 = splitStartCoordinate[0] ? Number(splitStartCoordinate[0]) : null;
    const searchLon0 = splitStartCoordinate[1] ? Number(splitStartCoordinate[1]) : null;
    const searchLat1 = splitEndCoordinate[0] ? Number(splitEndCoordinate[0]) : null;
    const searchLon1 = splitEndCoordinate[1] ? Number(splitEndCoordinate[1]) : null;

    return { searchLat0, searchLon0, searchLat1, searchLon1 };
  }

  /**
   * APIにデータを渡す前に、空文字・null・undefinedのプロパティを削除する関数
   * @param params 検索入力データ(座標の型変換済)
   * @returns 整理後のオブジェクト
   */
  deleteUnnecessaryProperty(params: any) {
    if (typeof params === "object" && params !== null) {
      return Object.fromEntries(Object.entries(params).filter(([k, v]) => v !== "" && v != null));
    }
    return {};
  }

  /**
   * 発生日時の値をリセットした上で、検索入力フォームの初期値を代入し、返却する関数
   * @returns 検索入力フォームの初期値
   */
  getInitialSearchForm() {
    this.fromDate = undefined;
    this.toDate = undefined;

    const initialSearchForm = new FormGroup({
      timestamp: new FormGroup({
        from: new FormControl(""),
        to: new FormControl(""),
      }),
      category: new FormControl("", [Validators.maxLength(MAX_LENGTH_PARTIAL_MATCH_WORDS)]),
      coordinates: new FormGroup(
        {
          startCoordinate: new FormControl("", [Validators.pattern(COORDINATE_REGEX)]),
          endCoordinate: new FormControl("", [Validators.pattern(COORDINATE_REGEX)]),
        },
        { validators: [checkCoordinatesCorrelation()] },
      ),
      name: new FormControl("", [Validators.maxLength(MAX_LENGTH_PARTIAL_MATCH_WORDS)]),
      summary: new FormControl("", [Validators.maxLength(MAX_LENGTH_PARTIAL_MATCH_WORDS)]),
      id: new FormControl("", [Validators.maxLength(MAX_LENGTH_UUID)]),
    });

    return initialSearchForm;
  }

  /**
   * チェックが入っていない場合に、csvダウンロードボタンを非活性にする関数
   */
  onSelectNearmissInfoCheckBox() {
    this.csvDownloadButtonDisabled = this.selectedNearmissInfo.length === 0;
  }

  /**
   * 発生地点一覧ボタン押下時にポップアップを表示する関数
   * @param nearmissInfo クリックした行のヒヤリハット
   */
  showCoordinateListDialog(nearmissInfo: NearmissInfoType) {
    this.nearmissCoordinateList = nearmissInfo.coordinates ?? [];
    this.openNearmissCoordinateListDialog = true;
  }

  /**
   * ファイル一覧ボタン押下時にポップアップを表示する関数
   * @param nearmissInfo クリックした行のヒヤリハット
   */
  showFileListDialog(nearmissInfo: NearmissInfoType) {
    this.nearmissFileList = nearmissInfo.files;
    this.openNearmissFileListDialog = true;
  }

  /**
   * CSVエクスポートの前処理
   * @param cell エクスポートするデータとカラム
   * @returns 形式変換後のデータ
   */
  prepareExportCsv(cell: { data: any; field: string }) {
    const { data, field } = cell;

    if (field === "coordinates" || field === "files") {
      try {
        // ダブルクォートのエスケープ処理
        return JSON.stringify(data).replace(/\"/g, '""');
      } catch (error) {
        return "";
      }
    } else if (field === "name" || field === "category" || field === "summary") {
      // ダブルクォートのエスケープ処理
      return data.replace(/\"/g, '""');
    } else {
      // no, id, timestampはエスケープなし
      return data;
    }
  }

  /** CSVダウンロードボタン押下時の処理 */
  onClickCsvDownloadButton() {
    // ファイル名の定義
    this.csvDownloadFileName = CSV_DOWNLOAD_FILENAME_PREFIX + "_" + dayjs().format("YYYYMMDDHHMMss");

    // 実行タイミングの遅延化(変更内容を反映させるため)
    setTimeout(() => {
      try {
        this.dt?.exportCSV({ selectionOnly: true });
        this.showSuccessMessage(this.messages.CSV_DOWNLOAD_SUCCESS_MESSAGE());
      } catch (error) {
        this.showErrorMessage(this.messages.CSV_DOWNLOAD_ERROR_MESSAGE());
      }
    });
  }

  /**
   * 処理が正常終了した時にポップアップを表示する関数
   * @param message メッセージ
   */
  showSuccessMessage(message: string) {
    this.messageService.add({ severity: "success", summary: "Success", detail: message });
  }

  /**
   * 処理が異常終了した時にポップアップを表示する関数
   * @param message メッセージ
   */
  showErrorMessage(message: string) {
    this.messageService.add({ severity: "error", summary: "Error", detail: message });
  }

  /**
   * 分類情報一覧取得APIからデータを取得する関数<br>
   * エラー時：エラーメッセージを表示
   */
  getListCategory() {
    this.data.listCategory().subscribe({
      next: (data: ListCategoryResponseDTO) => {
        this.categories = data.categories!.map((objData) => ({
          ...objData,
        }));
      },
      error: (error) => {
        this.showErrorMessage(this.messages.API_ERROR_LIST_CATEGORY_RESPONSE_MESSAGE());
      },
    });
  }

  /**
   * ヒヤリハット情報一覧データモデル取得APIからデータを取得する関数<br>
   * エラー時：エラーメッセージを表示
   * @param searchParams 検索入力データ(形式変換済)
   */
  getListNearmissInfo(searchParams?: ListNearmissInfoParams) {
    // 選択済データの初期化とダウンロードボタンの非活性化
    this.selectedNearmissInfo = [];
    this.csvDownloadButtonDisabled = true;

    this.data.listNearmissInfo(searchParams).subscribe({
      next: (data: ListNearmissInfoResponseDTO) => {
        this.listNearmissInfo = data.attribute
          .sort((a: any, b: any) => {
            if (a.timestamp === null) return 1;
            if (b.timestamp === null) return -1;
            return a.timestamp.localeCompare(b.timestamp);
          })
          .map((objData, index) => ({
            ...objData,
            no: index + 1,
          }));
      },
      error: (error) => {
        this.showErrorMessage(this.messages.API_ERROR_LISTNEARMISSINFO_RESPONSE_MESSAGE());
      },
    });
  }
}
