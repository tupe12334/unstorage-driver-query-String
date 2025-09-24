import { describe, it, expect } from "vitest";
import { QueryStringDriverError } from "./errors";

describe("QueryStringDriverError", () => {
  it("should create error with message", () => {
    const error = new QueryStringDriverError("Test error message");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(QueryStringDriverError);
    expect(error.message).toBe("Test error message");
    expect(error.name).toBe("QueryStringDriverError");
    expect(error.cause).toBeUndefined();
  });

  it("should create error with message and cause", () => {
    const originalError = new Error("Original error");
    const error = new QueryStringDriverError("Test error message", originalError);

    expect(error.message).toBe("Test error message");
    expect(error.name).toBe("QueryStringDriverError");
    expect(error.cause).toBe(originalError);
  });

  it("should create error with non-Error cause", () => {
    const cause = { code: "CUSTOM_ERROR", details: "Something went wrong" };
    const error = new QueryStringDriverError("Test error message", cause);

    expect(error.message).toBe("Test error message");
    expect(error.name).toBe("QueryStringDriverError");
    expect(error.cause).toEqual(cause);
  });

  it("should create error with string cause", () => {
    const error = new QueryStringDriverError("Test error message", "string cause");

    expect(error.message).toBe("Test error message");
    expect(error.name).toBe("QueryStringDriverError");
    expect(error.cause).toBe("string cause");
  });

  it("should create error with null cause", () => {
    const error = new QueryStringDriverError("Test error message", null);

    expect(error.message).toBe("Test error message");
    expect(error.name).toBe("QueryStringDriverError");
    expect(error.cause).toBe(null);
  });

  it("should have proper error stack", () => {
    const error = new QueryStringDriverError("Test error");

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("QueryStringDriverError");
    expect(error.stack).toContain("Test error");
  });
});