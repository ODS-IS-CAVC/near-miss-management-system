import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableNearmissInfo1725582062280 implements MigrationInterface {
    name = 'CreateTableNearmissInfo1725582062280'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hh"."nearmiss_info" ("id" uuid NOT NULL, "uri" character varying(4096) NOT NULL, "name" character varying(4096), "category" character varying(4096), "summary" character varying(4096), "timestamp" TIMESTAMP WITH TIME ZONE, "coordinates" xml, "attributes" xml, "files" xml NOT NULL, "is_display_enable" boolean NOT NULL DEFAULT true, "is_registered" boolean NOT NULL DEFAULT false, "upload_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "nearmiss_info_uri" UNIQUE ("uri"), CONSTRAINT "nearmiss_info_pkey" PRIMARY KEY ("id")); COMMENT ON COLUMN "hh"."nearmiss_info"."id" IS 'データID'; COMMENT ON COLUMN "hh"."nearmiss_info"."uri" IS 'uri'; COMMENT ON COLUMN "hh"."nearmiss_info"."name" IS '名称'; COMMENT ON COLUMN "hh"."nearmiss_info"."category" IS '分類'; COMMENT ON COLUMN "hh"."nearmiss_info"."summary" IS '要約'; COMMENT ON COLUMN "hh"."nearmiss_info"."timestamp" IS '発生日時'; COMMENT ON COLUMN "hh"."nearmiss_info"."coordinates" IS '発生地点'; COMMENT ON COLUMN "hh"."nearmiss_info"."attributes" IS '属性リスト'; COMMENT ON COLUMN "hh"."nearmiss_info"."files" IS 'ファイル情報'; COMMENT ON COLUMN "hh"."nearmiss_info"."is_display_enable" IS '表示可不可情報'; COMMENT ON COLUMN "hh"."nearmiss_info"."is_registered" IS '登録有無情報'; COMMENT ON COLUMN "hh"."nearmiss_info"."upload_timestamp" IS 'アップロード日時'`);
        await queryRunner.query(`COMMENT ON TABLE "hh"."nearmiss_info" IS 'ニアミス情報'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON TABLE "hh"."nearmiss_info" IS NULL`);
        await queryRunner.query(`DROP TABLE "hh"."nearmiss_info"`);
    }

}
