import path from "path";
import { Stack } from "@aws-cdk/core";
import NextjsCloudfront from "../src/constructs/NextjsCloudfront";
import "@aws-cdk/assert/jest";

describe("Given I want to provision a serverless next app with zero config", () => {
  let tmpDir: string;
  let stack: Stack;

  beforeEach(() => {
    tmpDir = process.cwd();
    process.chdir(path.join(__dirname, "./fixtures/zero-config-app"));
    stack = new Stack();
    const distribution = new NextjsCloudfront(stack, "testdistribution");
  });

  afterEach(() => {
    process.chdir(tmpDir);
  });

  it("creates new cloudfront distribution", () => {
    expect(stack).toHaveResource("AWS::CloudFront::Distribution");
  });

  it("creates an S3 bucket for static assets", () => {
    expect(stack).toHaveResource("AWS::S3::Bucket");
  });

  it("attaches an edge function to the default cache behaviour", () => {
    expect(stack).toHaveResourceLike("AWS::CloudFront::Distribution", {
      DistributionConfig: {
        DefaultCacheBehavior: {
          LambdaFunctionAssociations: [
            {
              EventType: "origin-request",
              LambdaFunctionARN: {
                "Fn::Join": [
                  "",
                  [
                    {
                      "Fn::GetAtt": [
                        "testdistributioncoreedgefnDE686A76",
                        "Arn"
                      ]
                    },
                    ":$LATEST"
                  ]
                ]
              }
            }
          ]
        }
      }
    });
  });

  it("creates a cache behaviour to forward _next/* requests to the assets bucket", () => {
    expect(stack).toHaveResourceLike("AWS::CloudFront::Distribution", {
      DistributionConfig: {
        CacheBehaviors: [{ PathPattern: "_next/*" }]
      }
    });
  });
});
