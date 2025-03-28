import { Body, Controller, Get, Put, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiProduces, ApiTags } from "@nestjs/swagger";
import { ListNearmissInfoQueryDTO } from "./dto/list-nearmiss-info-query.dto";
import { ListNearmissInfoResponseDTO } from "./dto/list-nearmiss-info-response.dto";
import { UpdateNearmissInfoResponseDTO } from "./dto/update-nearmiss-info-response.dto";
import { UpdateNearmissInfoBodyDTO } from "./dto/update-nearmiss-info-body.dto";
import { ValidateErrorResponseDTO } from "../common/dto/validate-error-response.dto";
import { NearmissService } from "./nearmiss.service";
import { ListCategoryResponseDTO } from "./dto/list-category-info-response.dto";
import { LogService } from "@nearmiss-manager/log/log.service";

/** ヒヤリハットAPIコントローラー */
@ApiTags("nearmiss")
@Controller()
export class NearmissController {
  /**
   * @param nearmissService ニアミスサービス
   * @param logger ログサービス
   */
  constructor(
    private readonly nearmissService: NearmissService,
    private readonly logger: LogService,
  ) {
    this.logger.setContext(NearmissController.name);
  }

  /**
   * ヒヤリハット情報リストを取得
   * @param input ヒヤリハット情報一覧データモデル取得APIリクエスト
   * @returns ヒヤリハット情報一覧データモデル取得APIレスポンス
   */
  @ApiOperation({
    summary: "C-3-2 ヒヤリハット情報一覧データモデル取得",
    description: "ヒヤリハット情報一覧データモデルのデータを取得します。",
  })
  @Get("nearmissinfolist")
  @ApiOkResponse({
    type: ListNearmissInfoResponseDTO,
  })
  @ApiBadRequestResponse({
    type: ValidateErrorResponseDTO,
    description: "リクエスト入力形式不備",
  })
  @ApiProduces("application/json")
  async listNearmissInfo(@Query() input: ListNearmissInfoQueryDTO) {
    try {
      return await this.nearmissService.listNearmissInfo(input);
    } catch (e) {
      this.logger.logError(e, e.message);
      throw e;
    }
  }

  /**
   * 抽出属性情報を更新
   * @param input ヒヤリハット抽出属性設定APIリクエスト
   * @returns ヒヤリハット抽出属性設定APIレスポンス
   */
  @ApiOperation({
    summary: "C-3-2 ヒヤリハット抽出属性設定",
    description: "ヒヤリハット抽出属性データモデルのデータを設定します。",
  })
  @Put("attributes")
  @ApiOkResponse({ type: UpdateNearmissInfoResponseDTO })
  @ApiBadRequestResponse({
    type: ValidateErrorResponseDTO,
    description: "リクエスト入力形式不備",
  })
  @ApiProduces("application/json")
  async updateNearmissInfo(@Body() input: UpdateNearmissInfoBodyDTO) {
    try {
      return await this.nearmissService.updateNearmissInfo(input);
    } catch (e) {
      this.logger.logError(e, e.message);
      throw e;
    }
  }

  /**
   * 分類情報リストを取得
   * @returns ListCategoryResponseDTO
   */
  @ApiOperation({
    summary: "C-3-2 分類情報一覧取得",
    description: "分類情報データ一覧を取得します。",
  })
  @Get("categorylist")
  @ApiOkResponse({
    type: ListCategoryResponseDTO,
  })
  @ApiProduces("application/json")
  async listCategory() {
    try {
      return await this.nearmissService.listCategory();
    } catch (e) {
      this.logger.logError(e, e.message);
      throw e;
    }
  }
}
