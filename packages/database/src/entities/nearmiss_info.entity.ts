import { BaseEntity, Column, Entity, PrimaryColumn, Unique } from "typeorm";

@Entity({
  schema: "hh",
  name: "nearmiss_info",
  comment: "ニアミス情報",
})
@Unique("nearmiss_info_uri", ["uri"])
export class NearmissInfoEntity extends BaseEntity {
  @PrimaryColumn({ type: "uuid", primaryKeyConstraintName: "nearmiss_info_pkey", comment: "データID" })
  id: string;

  @Column({ type: "varchar", length: 4096, comment: "uri" })
  uri: string;

  @Column({ type: "varchar", length: 4096, nullable: true, comment: "名称" })
  name?: string;

  @Column({ type: "varchar", length: 4096, nullable: true, comment: "分類" })
  category?: string;

  @Column({ type: "varchar", length: 4096, nullable: true, comment: "要約" })
  summary?: string;

  @Column({ type: "timestamptz", nullable: true, comment: "発生日時" })
  timestamp?: Date;

  @Column({ type: "xml", nullable: true, comment: "発生地点" })
  coordinates?: string;

  @Column({ type: "xml", nullable: true, comment: "属性リスト" })
  attributes?: string;

  @Column({ type: "xml", comment: "ファイル情報" })
  files: string;

  @Column({ type: "boolean", default: true, comment: "表示可不可情報" })
  is_display_enable: boolean;

  @Column({ type: "boolean", default: false, comment: "登録有無情報" })
  is_registered: boolean;

  @Column({ type: "timestamptz", comment: "アップロード日時" })
  upload_timestamp: Date;
}
