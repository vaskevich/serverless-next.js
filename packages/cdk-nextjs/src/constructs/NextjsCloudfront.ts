import { Construct } from "@aws-cdk/core";
import { CloudFrontWebDistribution } from "@aws-cdk/aws-cloudfront";
import { Bucket } from "@aws-cdk/aws-s3";

export default class CloudFrontNextjsDistribution extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const sourceBucket = new Bucket(scope, "PlaceholderBucket");

    const cfDistribution = new CloudFrontWebDistribution(
      scope,
      `${id}-cloudfront-distribution`,
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: sourceBucket
            },
            behaviors: [{ isDefaultBehavior: true }]
          }
        ]
      }
    );
  }
}
