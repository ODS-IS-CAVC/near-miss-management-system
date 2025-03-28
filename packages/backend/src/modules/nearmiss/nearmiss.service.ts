import { Injectable } from "@nestjs/common";
import { ListNearmissInfoQueryDTO } from "./dto/list-nearmiss-info-query.dto";
import { ListNearmissInfoResponseDTO } from "./dto/list-nearmiss-info-response.dto";
import { UpdateNearmissInfoBodyDTO } from "./dto/update-nearmiss-info-body.dto";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { NearmissInfo } from "./dto/nearmiss-info";
import {
  ATTRIBUTES_KEY_NAME,
  ATTRIBUTES_KEY_SUMMARY,
  ATTRIBUTES_XML_CHILDREN_NAME,
  ATTRIBUTES_XML_ROOT_NAME,
  COORDINATES_XML_CHILDREN_NAME,
  COORDINATES_XML_ROOT_NAME,
  DATA_MODEL_TYPE,
  FILES_XML_ROOT_NAME,
} from "../../consts/nearmiss";
import { NearmissInfoEntity } from "@nearmiss-manager/database/entities/nearmiss_info.entity";
import { plainToInstance } from "class-transformer";
import { escapeSpecialWord, extractSearchWords } from "../../utils/string-utils";
import { ListCategoryResponseDTO } from "./dto/list-category-info-response.dto";
import { UpdateNearmissInfoResponseDTO } from "./dto/update-nearmiss-info-response.dto";
import { LogService } from "@nearmiss-manager/log/log.service";
import { generateExecutionLogMessage, generateDatabaseLogMessage } from "@nearmiss-manager/log/utils/generate-log-message";
import { parseObjectArrayToXml, parseXmlToObjectArray } from "@nearmiss-manager/common/utils/parser";
import { LOG_API, LOG_DATABASE_OPERATION_TYPE, LOG_TABLE, LOG_TASK_TYPE } from "@nearmiss-manager/log/consts/log-message";

/** ヒヤリハットAPIサービスクラス */
@Injectable()
export class NearmissService {
  /**
   * @param dataSource データベース接続定義
   * @param nearmissRepository ニアミス情報テーブル
   * @param logger ログサービス
   */
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(NearmissInfoEntity)
    private readonly nearmissRepository: Repository<NearmissInfoEntity>,
    private readonly logger: LogService,
  ) {
    {
      this.logger.setContext(NearmissService.name);
    }
  }

  /**
   * ヒヤリハット情報リストを取得
   * @param input ヒヤリハット情報一覧データモデル取得APIリクエスト
   * @returns ヒヤリハット情報一覧データモデル取得APIレスポンス
   */
  async listNearmissInfo(input: ListNearmissInfoQueryDTO): Promise<ListNearmissInfoResponseDTO> {
    this.logger.logInfo(generateExecutionLogMessage(LOG_TASK_TYPE.START, LOG_API.NEARMISS_INFO_LIST));
    this.logger.logInfo("リクエスト情報" + JSON.stringify(input));

    this.logger.logInfo(generateDatabaseLogMessage(LOG_TASK_TYPE.START, LOG_DATABASE_OPERATION_TYPE.SELECT, LOG_TABLE.NEARMISS_INFO));
    // データ取得
    const result = await this.findNearmissInfo(input);

    this.logger.logInfo(generateDatabaseLogMessage(LOG_TASK_TYPE.END, LOG_DATABASE_OPERATION_TYPE.SELECT, LOG_TABLE.NEARMISS_INFO));

    // 検索結果のxml情報をオブジェクト配列に変換した結果を含めて詰替
    const parsedResult = await Promise.all(
      result.map(async (entity: NearmissInfoEntity) => {
        return {
          ...entity,
          coordinates: await parseXmlToObjectArray(COORDINATES_XML_ROOT_NAME, entity.coordinates),
          attributes: await parseXmlToObjectArray(ATTRIBUTES_XML_ROOT_NAME, entity.attributes),
          files: await parseXmlToObjectArray(FILES_XML_ROOT_NAME, entity.files),
        };
      }),
    );

    // レスポンス用にマッピング
    const attribute = plainToInstance(NearmissInfo, parsedResult, { excludeExtraneousValues: true });
    const res: ListNearmissInfoResponseDTO = {
      dataModelType: DATA_MODEL_TYPE,
      attribute: attribute,
    };

    this.logger.logInfo(generateExecutionLogMessage(LOG_TASK_TYPE.END, LOG_API.NEARMISS_INFO_LIST));
    return res;
  }

  /**
   * inputを検索条件に設定し、データベースから検索を実行
   * @param input ヒヤリハット情報一覧データモデル取得APIリクエスト
   * @returns 検索結果
   */
  private async findNearmissInfo(input: ListNearmissInfoQueryDTO): Promise<NearmissInfoEntity[]> {
    const queryBuilder = this.nearmissRepository.createQueryBuilder("nearmissInfo");

    if (input.id) {
      queryBuilder.andWhere("CAST(nearmissInfo.id AS TEXT) LIKE :id", { id: `%${input.id}%` });
    }

    if (input.name) {
      const nameConditions = extractSearchWords(input.name);
      nameConditions.forEach((word, index) => {
        const escapedWord = escapeSpecialWord(word);
        queryBuilder.andWhere(`nearmissInfo.name LIKE :nameCondition${index}`, { [`nameCondition${index}`]: `%${escapedWord}%` });
      });
    }

    if (input.category) {
      const categoryConditions = extractSearchWords(input.category);
      categoryConditions.forEach((word, index) => {
        const escapedWord = escapeSpecialWord(word);
        queryBuilder.andWhere(`nearmissInfo.category LIKE :categoryCondition${index}`, {
          [`categoryCondition${index}`]: `%${escapedWord}%`,
        });
      });
    }

    if (input.summary) {
      const summaryConditions = extractSearchWords(input.summary);
      summaryConditions.forEach((word, index) => {
        const escapedWord = escapeSpecialWord(word);
        queryBuilder.andWhere(`nearmissInfo.summary LIKE :summaryCondition${index}`, { [`summaryCondition${index}`]: `%${escapedWord}%` });
      });
    }

    // 下限値（包含）
    if (input.from) {
      queryBuilder.andWhere("nearmissInfo.timestamp >= :from", { from: input.from });
    }
    // 上限値（排他）
    if (input.to) {
      queryBuilder.andWhere("nearmissInfo.timestamp < :to", { to: input.to });
    }

    // lat0があればその他は設定されている為チェックなし
    if (input.lat0 != null) {
      // 下限緯度（包含）
      const s = input.lat0;
      // 下限経度（包含）
      const w = input.lon0;
      // 上限緯度（包含）
      const n = input.lat1;
      // 上限経度（包含）
      const e = input.lon1;

      queryBuilder.andWhere(
        `
          EXISTS (
            SELECT 1
            FROM unnest(
                  array(
                    SELECT unnest(xpath('//coordinate/lat/text()', coordinates::xml)::TEXT[])
                  )
                ) AS latitudes,
                unnest(
                  array(
                    SELECT unnest(xpath('//coordinate/lon/text()', coordinates::xml)::TEXT[])
                  )
                ) AS longitudes
            WHERE (latitudes::NUMERIC BETWEEN :s AND :n)
              AND (longitudes::NUMERIC BETWEEN :w AND :e)
          )`,
        { s, w, n, e },
      );
    }
    return queryBuilder.getMany();
  }

  /**
   * 抽出属性情報を更新
   * @param input ヒヤリハット抽出属性設定APIリクエスト
   * @returns ヒヤリハット抽出属性設定APIレスポンス
   */
  async updateNearmissInfo(input: UpdateNearmissInfoBodyDTO): Promise<UpdateNearmissInfoResponseDTO> {
    this.logger.logInfo(generateExecutionLogMessage(LOG_TASK_TYPE.START, LOG_API.ATTRIBUTES));
    this.logger.logInfo("リクエスト情報" + JSON.stringify(input));
    // input.attribute配列から抽出した値を代入する変数
    let extractName: string = null;
    let extractSummary: string = null;
    // xml変換用変数
    let coordinatesXml: string = null;
    let attributesXml: string = null;
    if (input.attributes) {
      input.attributes.map((attribute) => {
        if (attribute.key === ATTRIBUTES_KEY_NAME) {
          extractName = attribute.value;
        }
        if (attribute.key === ATTRIBUTES_KEY_SUMMARY) {
          extractSummary = attribute.value;
        }
      });
      attributesXml = parseObjectArrayToXml(ATTRIBUTES_XML_ROOT_NAME, ATTRIBUTES_XML_CHILDREN_NAME, input.attributes);
    }
    if (input.coordinates) {
      coordinatesXml = parseObjectArrayToXml(COORDINATES_XML_ROOT_NAME, COORDINATES_XML_CHILDREN_NAME, input.coordinates);
    }

    await this.dataSource.transaction(async (em) => {
      this.logger.logInfo(generateDatabaseLogMessage(LOG_TASK_TYPE.START, LOG_DATABASE_OPERATION_TYPE.UPDATE, LOG_TABLE.NEARMISS_INFO));
      // データ更新
      const repository = em.getRepository(NearmissInfoEntity);
      const updateResult = await repository.update(input.id, {
        name: extractName,
        summary: extractSummary,
        category: input.category,
        timestamp: input.timestamp,
        coordinates: coordinatesXml,
        attributes: attributesXml,
        is_registered: true,
      });

      if (updateResult.affected === 0) {
        throw new Error("指定のuuidから更新対象のデータが見つかりませんでした。");
      }
      this.logger.logInfo(generateDatabaseLogMessage(LOG_TASK_TYPE.END, LOG_DATABASE_OPERATION_TYPE.UPDATE, LOG_TABLE.NEARMISS_INFO));
    });
    this.logger.logInfo(generateExecutionLogMessage(LOG_TASK_TYPE.END, LOG_API.ATTRIBUTES));
    return;
  }

  /**
   * 分類情報リストを取得
   * @returns ListCategoryResponseDTO
   */
  async listCategory(): Promise<ListCategoryResponseDTO> {
    this.logger.logInfo(generateExecutionLogMessage(LOG_TASK_TYPE.START, LOG_API.CATEGORY_LIST));
    this.logger.logInfo(generateDatabaseLogMessage(LOG_TASK_TYPE.START, LOG_DATABASE_OPERATION_TYPE.SELECT, LOG_TABLE.NEARMISS_INFO));
    const queryBuilder = this.nearmissRepository.createQueryBuilder("nearmissInfo");
    // データ取得
    const result = await queryBuilder
      .select("nearmissInfo.category")
      .distinctOn(["nearmissInfo.category"])
      .orderBy("nearmissInfo.category", "ASC")
      .getMany();

    this.logger.logInfo(generateDatabaseLogMessage(LOG_TASK_TYPE.END, LOG_DATABASE_OPERATION_TYPE.SELECT, LOG_TABLE.NEARMISS_INFO));

    const categories = await Promise.all(
      result.map(async (entity: NearmissInfoEntity) => {
        return {
          label: entity.category,
        };
      }),
    );

    this.logger.logInfo(generateExecutionLogMessage(LOG_TASK_TYPE.END, LOG_API.CATEGORY_LIST));
    return {
      categories: categories,
    };
  }
}
