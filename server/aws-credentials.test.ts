import { describe, it, expect } from "vitest";

describe("AWS Credentials Validation", () => {
  it("should have AWS credentials configured", () => {
    expect(process.env.AWS_ACCESS_KEY_ID).toBeDefined();
    expect(process.env.AWS_SECRET_ACCESS_KEY).toBeDefined();
    expect(process.env.AWS_REGION).toBeDefined();
    expect(process.env.DYNAMODB_TABLE).toBeDefined();
  });

  it("should have valid AWS region", () => {
    const validRegions = [
      "eu-north-1",
      "us-east-1",
      "us-west-2",
      "eu-west-1",
      "ap-southeast-1",
      "ap-northeast-1",
    ];
    expect(validRegions).toContain(process.env.AWS_REGION);
  });

  it("should have non-empty credentials", () => {
    expect(process.env.AWS_ACCESS_KEY_ID?.length).toBeGreaterThan(0);
    expect(process.env.AWS_SECRET_ACCESS_KEY?.length).toBeGreaterThan(0);
    expect(process.env.DYNAMODB_TABLE?.length).toBeGreaterThan(0);
  });

  it("should have valid DynamoDB table name", () => {
    const tableName = process.env.DYNAMODB_TABLE;
    // Table names should be alphanumeric with hyphens
    expect(tableName).toMatch(/^[a-zA-Z0-9_-]+$/);
  });
});
