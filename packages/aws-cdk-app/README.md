# aws-cdk-app

AWSとの連携テスト用のプロジェクトです。  
LocalStackのコンテナが立っているので、ローカル環境でテストすることができます。  
開発用コンテナ内では設定なしでLocalStackを操作するためのCLIが使える状態になっています。

- `awslocal`: `aws`のLocalStack版
- `cdklocal`: `cdk`のLocalStack版

```bash
cd packages/backend/
# backendをサーバーレス用にビルド
npm run build:webpack

cd ../aws-cdk-app

# CDKコードをcloudformationに変換
cdklocal synth

# LocalStackにデプロイ
cdklocal deploy
```

とするとLocalStack上にLambda, API Gatewayがデプロイされます。  
下記URLがNestJSのルートに対応しているので、各APIの動作確認ができます。

http://localhost:4566/restapis/{API*ID}/prod/\_user_request*/

※API_IDはデプロイ時にログに出力されるので、適宜読み替えてください
