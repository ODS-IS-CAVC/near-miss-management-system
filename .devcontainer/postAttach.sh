# gitの設定
git config --global --add safe.directory /workspace
git config pull.rebase false

npm i

npm i -g license-checker

cd /workspace/packages/backend/
cp .env.sample .env
npm run build:webpack

cd /workspace/packages/batch-import/
cp .env.sample .env
npm run build:webpack

# aws-cdk-appをLocalStackにデプロイするための前準備
cd /workspace/packages/aws-cdk-app
cdklocal bootstrap
