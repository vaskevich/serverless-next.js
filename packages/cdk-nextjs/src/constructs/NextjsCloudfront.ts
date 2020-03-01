import path from "path";
import { Function, Code, Runtime } from "@aws-cdk/aws-lambda";
import { Construct } from "@aws-cdk/core";
import {
  CloudFrontWebDistribution,
  LambdaEdgeEventType
} from "@aws-cdk/aws-cloudfront";
import { Bucket } from "@aws-cdk/aws-s3";
import { BucketDeployment, Source } from "@aws-cdk/aws-s3-deployment";

export default class NextjsCloudfront extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const assetsBucket = new Bucket(scope, `${id}-static-assets-bucket`);

    const bucketDeployment = new BucketDeployment(this, "DeployWebsite", {
      sources: [Source.asset("./.next")],
      destinationBucket: assetsBucket,
      destinationKeyPrefix: "static"
    });

    const coreEdgeFn = new Function(scope, `${id}-core-edge-fn`, {
      runtime: Runtime.NODEJS_10_X,
      handler: "index.handler",
      code: Code.fromAsset(path.join("./.cdk-nextjs/core-edge-fn"))
    });

    const cfDistribution = new CloudFrontWebDistribution(
      scope,
      `${id}-cloudfront-distribution`,
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: assetsBucket
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                lambdaFunctionAssociations: [
                  {
                    eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
                    lambdaFunction: coreEdgeFn.latestVersion
                  }
                ]
              }
            ]
          },
          {
            s3OriginSource: {
              s3BucketSource: assetsBucket
            },
            behaviors: [{ pathPattern: "_next/*" }]
          }
        ]
      }
    );
  }
}
