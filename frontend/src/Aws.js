import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: "AKIAYUCFJED7SH44Z4DC",
  secretAccessKey: "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",
  region: "us-east-1",
});

export const s3 = new AWS.S3();