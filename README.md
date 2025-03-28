
# ニアミス管理システム

## 概要

ニアミス管理システムは、以下の機能を提供します。

- 検索条件を元に、蓄積されたニアミス属性情報から該当するデータを検索・取得する。

ニアミス情報共有システムは、シミュレーション生成アプリ(sim-generation-app)と、ニアミス管理システムで構成されます。 ニアミス情報共有システムを構成する場合は、シミュレーション生成アプリとの連携が必要です。

## インデックス

- [ニアミス管理システム](#ニアミス管理システム)
  - [概要](#概要)
  - [インデックス](#インデックス)
  - [前提ソフトウェア](#前提ソフトウェア)
  - [環境構築](#環境構築)
  - [動作確認(ローカル)](#動作確認ローカル)
    - [各コンテナについて](#各コンテナについて)
    - [各パッケージについて](#各パッケージについて)
      - [database](#database)
      - [backend](#backend)
      - [frontend](#frontend)
    - [起動確認](#起動確認)
  - [注意事項](#注意事項)
  - [Issues, Pull Requests](#issues-pull-requests)
  - [ライセンス](#ライセンス)
  - [免責事項](#免責事項)
  - [詳細仕様](#詳細仕様)

## 前提ソフトウェア
下記の環境でビルドを実行しました。

|ソフトウェア|バージョン|
|---|---|
|WSL|WSL2|
|Ubuntu|v22.04.3|
|Docker|v27.2.0|
|Docker Compose|v2.29.2|
|node|v20.18.3|
|Angular（package.jsonで定義済）|18.1.3|
|VS Code|1.97.2|

## 環境構築

WSL上にリポジトリをクローンしてVSCodeで開いてください。

VSCodeを開いたら検索バーから`> Dev Containers: Open Folder in Container`を検索して実行すると、定義した開発コンテナ内で開きます。

## 動作確認(ローカル)

### 各コンテナについて

各コンテナの定義は`docker/`配下で定義しています。

- [PostgreSQL(PostGIS)](https://hub.docker.com/_/postgres)

データベース用のコンテナです。

- [LocalStack](https://hub.docker.com/r/localstack/localstack)

LocalStack用のコンテナです。

https://docs.localstack.cloud/overview/

起動しているサービスの一覧は`docker/docker-compose.yml`の`SERVICES`の環境変数を参照してください。

- App

開発用のコンテナです。  
リポジトリのルートフォルダをそのままマウントしています。

backend, frontendの起動はこのコンテナ内で行います。

### 各パッケージについて

#### database

```bash
cd packages/database/

# .envファイルの作成
cp .env.sample .env

# migration適用
npm run typeorm:run
```

#### backend

```bash
cd packages/backend/

# .envファイルの作成
cp .env.sample .env

# 開発サーバー起動
npm run start

- API: http://localhost:3010/api/path/to/endpoint
- Swagger UI: http://localhost:3010/openapi
- OpenAPI(json): http://localhost:3010/openapi-json
- OpenAPI(yaml): http://localhost:3010/openapi-yaml
```

#### frontend

```bash
cd packages/frontend/

# .envファイルの作成
cp .env.sample .env

# backendのopenapiから型、クライアントコードを自動生成
npm run orval（backendを起動させた状態で実行）

# 開発サーバー起動
npm run start
```

### 起動確認

```bash
# database（接続情報は docker/docker-compose.ymlのdatabase接続情報を参照）　
データベース操作GUI（A5m2やDbeaver等)で nearmiss_infoが作成されていること

# backend
http://localhost:3010/openapi OpenAPIが確認できること

# frontend
http://localhost:4210 Angularのデフォルト画面が表示されること
```

## 注意事項

- Google Chrome の最新版で動作を確認しています。
- プロジェクトの特性に合わせて自由に拡張してください。

## Issues, Pull Requests

公開当初は利用も実証事業に限定されることが想定されるため、イシュー発行、プルリクエスト機能による問合せは受け付けません。

## ライセンス

- 本リポジトリはMITライセンスで提供されています。
- ソースコードおよび関連ドキュメントの著作権は、ダイナミックマッププラットフォーム株式会社に帰属します。

## 免責事項
- 本リポジトリの内容は予告なく変更・削除する可能性があります。
- 本リポジトリの利用により生じた損失及び損害等について、いかなる責任も負わないものとします。
## 詳細仕様
- APIの詳細については[API仕様書](docs)を公開しています。
- DBの詳細については[データベース構築手順](docs/DatabaseConstructionProcedure.md)を公開しています。
