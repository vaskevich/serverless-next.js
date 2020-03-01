import { Stack } from "@aws-cdk/core";
import NextDistribution from "../src/constructs/NextjsCloudfront";
import { SynthUtils } from "@aws-cdk/assert";

import "@aws-cdk/assert/jest";

describe("Given I want to provision a serverless next app with zero config", () => {
  it("creates new cloudfront distribution", () => {
    const stack = new Stack();
    const dist = new NextDistribution(stack, "TestDistribution");

    expect(stack).toHaveResource("AWS::CloudFront::Distribution");
  });

  it("creates an S3 bucket for static assets", () => {
    const stack = new Stack();
    const dist = new NextDistribution(stack, "TestDistribution");

    expect(stack).toHaveResource("AWS::S3::Bucket");
  });
});
