import { describe, it, expect, vi, beforeEach } from "vitest";
import { createDataManager } from "./data-manager";
import type { UrlManager } from "./url-manager-interface";
import { parseQueryString } from "./query-parser";

// Mock the query-parser
vi.mock("./query-parser", () => ({
  parseQueryString: vi.fn(),
}));

describe("DataManager", () => {
  let mockUrlManager: UrlManager;
  let dataManager: ReturnType<typeof createDataManager>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUrlManager = {
      getUrl: vi.fn(),
      updateInternalUrl: vi.fn(),
    };
    dataManager = createDataManager(mockUrlManager);
  });

  describe("getCurrentData", () => {
    it("should return empty object when no query string", () => {
      mockUrlManager.getUrl = vi.fn().mockReturnValue(new URL("https://example.com"));

      const result = dataManager.getCurrentData();

      expect(result).toEqual({});
    });

    it("should parse query string and return all data when no base", () => {
      const mockData = { foo: "bar", baz: 123 };
      mockUrlManager.getUrl = vi.fn().mockReturnValue(new URL("https://example.com?foo=bar&baz=123"));
      vi.mocked(parseQueryString).mockReturnValue(mockData);

      const result = dataManager.getCurrentData();

      expect(parseQueryString).toHaveBeenCalledWith("foo=bar&baz=123");
      expect(result).toEqual(mockData);
    });

    it("should return data for specific base when provided", () => {
      const mockData = {
        app: { user: "john", theme: "dark" },
        other: { setting: "value" }
      };
      mockUrlManager.getUrl = vi.fn().mockReturnValue(new URL("https://example.com?test=query"));
      vi.mocked(parseQueryString).mockReturnValue(mockData);

      const result = dataManager.getCurrentData("app");

      expect(result).toEqual({ user: "john", theme: "dark" });
    });

    it("should return empty object when base data is not a record object", () => {
      const mockData = { app: "not-an-object" };
      mockUrlManager.getUrl = vi.fn().mockReturnValue(new URL("https://example.com?test=query"));
      vi.mocked(parseQueryString).mockReturnValue(mockData);

      const result = dataManager.getCurrentData("app");

      expect(result).toEqual({});
    });

    it("should return empty object when base not found", () => {
      const mockData = { other: { setting: "value" } };
      mockUrlManager.getUrl = vi.fn().mockReturnValue(new URL("https://example.com?test=query"));
      vi.mocked(parseQueryString).mockReturnValue(mockData);

      const result = dataManager.getCurrentData("nonexistent");

      expect(result).toEqual({});
    });
  });
});