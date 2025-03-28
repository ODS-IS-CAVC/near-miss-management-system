import { Injectable } from "@nestjs/common";
import { DeleteObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { NearmissInfoEntity } from "@nearmiss-manager/database/entities/nearmiss_info.entity";
import { getFileExtension } from "../../utils/file";
import { LogService } from "@nearmiss-manager/log/log.service";
import { FILES_XML_ROOT_NAME, FILES_XML_CHILDREN_NAME } from "../../consts/import";
import { parseObjectArrayToXml } from "@nearmiss-manager/common/utils/parser";
import {
  LOG_EXTERNAL_API,
  LOG_DATABASE_OPERATION_TYPE,
  LOG_TABLE,
  LOG_TASK_TYPE,
  LOG_BATCH,
} from "@nearmiss-manager/log/consts/log-message";
import { generateExecutionLogMessage, generateDatabaseLogMessage } from "@nearmiss-manager/log/utils/generate-log-message";
import { isValidUuid } from "@nearmiss-manager/common/utils/validate-check";
import { FileInfo } from "@nearmiss-manager/backend/modules/nearmiss/dto/file-info";
import axios from "axios";

/** インポートバッチサービスクラス */
@Injectable()
export class ImportService {
  private s3: S3Client;
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
    this.logger.setContext(ImportService.name);
    if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "stg") {
      this.s3 = new S3Client();
    } else {
      // localstack用
      this.s3 = new S3Client({
        endpoint: "http://localstack:4566",
        credentials: {
          accessKeyId: "test",
          secretAccessKey: "test",
        },
        region: "us-east-1",
        forcePathStyle: true,
      });
    }
  }

  /**
   * インポートバッチ処理
   * @param event S3イベント情報
   */
  async handleS3Event(event: any): Promise<void> {
    try {
      this.logger.logInfo(generateExecutionLogMessage(LOG_TASK_TYPE.START, LOG_BATCH.IMPORT));
      this.logger.logInfo("S3イベント情報" + JSON.stringify(event));

      const uploadTimestamp = event.inputTime;
      const bucketName = event.inputBucketName;
      const trigerObjectKey = event.inputS3Key;
      const uuid = trigerObjectKey.split("/")[0];
      const prefix = `${uuid}/`;
      const directoryUri = `${process.env.S3_URI}/${bucketName}/${uuid}`;

      if (!isValidUuid(uuid)) {
        // uuid形式が不正の場合はエラースロー
        throw new Error(`${uuid}:uuid形式が正しくありません。`);
      }

      this.logger.logInfo(generateExecutionLogMessage(LOG_TASK_TYPE.START, LOG_EXTERNAL_API.S3_LIST_OBJECTS_V2));

      // S3からファイル情報を取得
      const listObjectsResponse = await this.s3.send(
        new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: prefix,
        }),
      );
      this.logger.logInfo("レスポンス情報" + JSON.stringify(listObjectsResponse.Contents));
      this.logger.logInfo(generateExecutionLogMessage(LOG_TASK_TYPE.END, LOG_EXTERNAL_API.S3_LIST_OBJECTS_V2));
      this.logger.logInfo(generateExecutionLogMessage(LOG_TASK_TYPE.START, LOG_EXTERNAL_API.S3_DELETE_OBJECTS));

      // S3からconfig.txtを削除
      await this.s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: trigerObjectKey }));

      this.logger.logInfo(generateExecutionLogMessage(LOG_TASK_TYPE.END, LOG_EXTERNAL_API.S3_DELETE_OBJECTS));

      const files = listObjectsResponse.Contents.filter((item) => item.Key !== trigerObjectKey && item.Key !== prefix).map(
        (item) =>
          ({
            type: getFileExtension(item.Key),
            size: item.Size,
            uri: `${process.env.S3_URI}/${bucketName}/${item.Key}`,
          }) as FileInfo,
      );
      if (!files || files.length === 0) {
        // files情報が空の場合はエラースロー
        throw new Error("file情報がありません");
      }
      const xmlFiles = parseObjectArrayToXml(FILES_XML_ROOT_NAME, FILES_XML_CHILDREN_NAME, files);

      // インポート情報をデータベースに登録
      await this.dataSource.transaction(async (em) => {
        this.logger.logInfo(generateDatabaseLogMessage(LOG_TASK_TYPE.START, LOG_DATABASE_OPERATION_TYPE.INSERT, LOG_TABLE.NEARMISS_INFO));
        const repository = em.getRepository(NearmissInfoEntity);
        await repository.save({
          id: uuid,
          uri: directoryUri,
          files: xmlFiles,
          upload_timestamp: uploadTimestamp,
        });
        this.logger.logInfo(generateDatabaseLogMessage(LOG_TASK_TYPE.END, LOG_DATABASE_OPERATION_TYPE.INSERT, LOG_TABLE.NEARMISS_INFO));
        this.logger.logInfo(generateExecutionLogMessage(LOG_TASK_TYPE.START, LOG_EXTERNAL_API.EXTRACT_ATTRIBUTES));
        this.logger.logInfo("リクエスト情報" + JSON.stringify({ id: uuid, uri: directoryUri }));

        // C3-1属性抽出依頼APIに連携
        await axios.post(
          process.env.EXTRACT_ATTRIBUTES_API_URL,
          { id: uuid, uri: directoryUri },
          { headers: { "x-api-key": process.env.EXTRACT_ATTRIBUTES_API_KEY } },
        );

        this.logger.logInfo(generateExecutionLogMessage(LOG_TASK_TYPE.END, LOG_EXTERNAL_API.EXTRACT_ATTRIBUTES));
      });
      this.logger.logInfo(generateExecutionLogMessage(LOG_TASK_TYPE.END, LOG_BATCH.IMPORT));
    } catch (e) {
      this.logger.logError(e, e.message);
      throw e;
    }
  }
}
