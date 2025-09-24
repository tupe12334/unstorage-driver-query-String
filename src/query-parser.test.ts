import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseQueryString } from "./query-parser";
import qs from "qs";

// Mock qs library
vi.mock("qs", () => ({
  default: {
    parse: vi.fn(),
  },
}));

describe("Query Parser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should parse query string using qs with correct options", () => {
    const mockResult = { foo: "bar", nested: { key: "value" } };
    vi.mocked(qs.parse).mockReturnValue(mockResult);

    const result = parseQueryString("foo=bar&nested[key]=value");

    expect(qs.parse).toHaveBeenCalledWith("foo=bar&nested[key]=value", {
      depth: 10,
      parseArrays: true,
    });
    expect(result).toEqual(mockResult);
  });

  it("should handle empty query string", () => {
    const mockResult = {};
    vi.mocked(qs.parse).mockReturnValue(mockResult);

    const result = parseQueryString("");

    expect(qs.parse).toHaveBeenCalledWith("", {
      depth: 10,
      parseArrays: true,
    });
    expect(result).toEqual({});
  });

  it("should handle complex nested structures", () => {
    const mockResult = {
      user: {
        name: "John",
        preferences: {
          theme: "dark",
          notifications: ["email", "push"],
        },
      },
    };
    vi.mocked(qs.parse).mockReturnValue(mockResult);

    const result = parseQueryString("user[name]=John&user[preferences][theme]=dark&user[preferences][notifications][]=email&user[preferences][notifications][]=push");

    expect(result).toEqual(mockResult);
  });
});