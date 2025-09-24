import { describe, it, expect, vi, beforeEach } from "vitest";
import { stringifyData } from "./query-stringifier";
import qs from "qs";

// Mock qs library
vi.mock("qs", () => ({
  default: {
    stringify: vi.fn(),
  },
}));

describe("Query Stringifier", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should stringify data using qs with correct options", () => {
    const testData = { foo: "bar", nested: { key: "value" } };
    const expectedResult = "foo=bar&nested[key]=value";
    vi.mocked(qs.stringify).mockReturnValue(expectedResult);

    const result = stringifyData(testData);

    expect(qs.stringify).toHaveBeenCalledWith(testData, {
      encode: true,
      addQueryPrefix: false,
      arrayFormat: "brackets",
    });
    expect(result).toBe(expectedResult);
  });

  it("should handle empty object", () => {
    const testData = {};
    const expectedResult = "";
    vi.mocked(qs.stringify).mockReturnValue(expectedResult);

    const result = stringifyData(testData);

    expect(qs.stringify).toHaveBeenCalledWith(testData, {
      encode: true,
      addQueryPrefix: false,
      arrayFormat: "brackets",
    });
    expect(result).toBe("");
  });

  it("should handle arrays with bracket format", () => {
    const testData = { items: ["a", "b", "c"] };
    const expectedResult = "items[]=a&items[]=b&items[]=c";
    vi.mocked(qs.stringify).mockReturnValue(expectedResult);

    const result = stringifyData(testData);

    expect(result).toBe(expectedResult);
  });

  it("should handle complex nested structures", () => {
    const testData = {
      user: {
        name: "John",
        preferences: {
          theme: "dark",
          notifications: ["email", "push"],
        },
      },
    };
    const expectedResult = "user[name]=John&user[preferences][theme]=dark&user[preferences][notifications][]=email&user[preferences][notifications][]=push";
    vi.mocked(qs.stringify).mockReturnValue(expectedResult);

    const result = stringifyData(testData);

    expect(result).toBe(expectedResult);
  });
});