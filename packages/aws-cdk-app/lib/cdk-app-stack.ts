import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";

export class CdkAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new cdk.aws_s3.Bucket(this, "S3Bucket", {
      bucketName: "c3-2-bucket",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    bucket.enableEventBridgeNotification();

    const eventRule = new cdk.aws_events.Rule(this, "S3EventRule", {
      ruleName: "catchConfigS3Upload",
      eventPattern: {
        source: ["aws.s3"],
        detailType: ["Object Created"],
        detail: {
          bucket: {
            name: ["c3-2-bucket"],
          },
          object: {
            key: [{ prefix: "upload/" }, { suffix: "config.txt" }],
          },
        },
      },
    });

    const nestBatch = new cdk.aws_lambda.Function(this, "LambdaBatchFunction", {
      runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
      handler: "main.handler",
      code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, "../../batch-import/dist")),
      environment: {
        NO_COLOR: "true",
        DB_HOST: "database",
        DB_PORT: "5432",
        DB_DATABASE: "HHDB",
        DB_SCHEMA: "hh",
        DB_USERNAME: "postgres",
        DB_PASSWORD: "postgres",
      },
    });
    bucket.grantRead(nestBatch);
    eventRule.addTarget(new cdk.aws_events_targets.LambdaFunction(nestBatch));

    const nestApp = new cdk.aws_lambda.Function(this, "LambdaFunction", {
      runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
      handler: "main.handler",
      code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, "../../backend/dist")),
      environment: {
        NO_COLOR: "true",
        DB_HOST: "database",
        DB_PORT: "5432",
        DB_DATABASE: "HHDB",
        DB_SCHEMA: "hh",
        DB_USERNAME: "postgres",
        DB_PASSWORD: "postgres",
      },
    });
    new cdk.aws_apigateway.LambdaRestApi(this, "APIEndpoint", {
      handler: nestApp,
      deployOptions: {
        tracingEnabled: true,
        dataTraceEnabled: true,
        loggingLevel: cdk.aws_apigateway.MethodLoggingLevel.INFO,
      },
    });
  }
}
