import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createUrlUpdater } from "./url-updater";
import type { UrlManager } from "./url-manager-interface";
import type { QueryStringDriverOptions } from "./types";
import { stringifyData } from "./query-stringifier";
import { parseQueryString } from "./query-parser";

// Mock dependencies
vi.mock("./query-stringifier", () => ({
  stringifyData: vi.fn(),
}));

vi.mock("./query-parser", () => ({
  parseQueryString: vi.fn(),
}));

describe("URL Updater", () => {
  let mockUrlManager: UrlManager;
  let originalWindow: typeof global.window;
  let mockConsoleWarn: vi.SpyInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    originalWindow = global.window;
    mockConsoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});

    mockUrlManager = {
      getUrl: vi.fn(),
      updateInternalUrl: vi.fn(),
    };
  });

  afterEach(() => {
    global.window = originalWindow;
    mockConsoleWarn.mockRestore();
  });

  describe("basic functionality", () => {
    it("should update URL with new data", () => {
      const currentUrl = new URL("https://example.com/path");
      mockUrlManager.getUrl = vi.fn().mockReturnValue(currentUrl);
      vi.mocked(stringifyData).mockReturnValue("foo=bar&baz=123");

      const options: QueryStringDriverOptions = { url: "https://example.com/path" };
      const updateUrl = createUrlUpdater(mockUrlManager, options);

      updateUrl({ foo: "bar", baz: 123 });

      expect(mockUrlManager.updateInternalUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          href: "https://example.com/path?foo=bar&baz=123",
        })
      );
    });

    it("should handle empty data by clearing query string", () => {
      const currentUrl = new URL("https://example.com/path?existing=param");
      mockUrlManager.getUrl = vi.fn().mockReturnValue(currentUrl);
      vi.mocked(stringifyData).mockReturnValue("");

      const options: QueryStringDriverOptions = { url: "https://example.com/path" };
      const updateUrl = createUrlUpdater(mockUrlManager, options);

      updateUrl({});

      expect(mockUrlManager.updateInternalUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          href: "https://example.com/path",
          search: "",
        })
      );
    });
  });

  describe("base prefix handling", () => {
    it("should use base prefix when provided", () => {
      const currentUrl = new URL("https://example.com/?other=value");
      mockUrlManager.getUrl = vi.fn().mockReturnValue(currentUrl);
      vi.mocked(parseQueryString).mockReturnValue({ other: "value" });
      vi.mocked(stringifyData).mockReturnValue("other=value&app[foo]=bar");

      const options: QueryStringDriverOptions = { base: "app", url: "https://example.com/" };
      const updateUrl = createUrlUpdater(mockUrlManager, options);

      updateUrl({ foo: "bar" });

      expect(parseQueryString).toHaveBeenCalledWith("other=value");
      expect(stringifyData).toHaveBeenCalledWith({
        other: "value",
        app: { foo: "bar" },
      });
    });

    it("should handle existing base data", () => {
      const currentUrl = new URL("https://example.com/?app[existing]=value");
      mockUrlManager.getUrl = vi.fn().mockReturnValue(currentUrl);
      vi.mocked(parseQueryString).mockReturnValue({ app: { existing: "value" } });
      vi.mocked(stringifyData).mockReturnValue("app[existing]=value&app[new]=data");

      const options: QueryStringDriverOptions = { base: "app", url: "https://example.com/" };
      const updateUrl = createUrlUpdater(mockUrlManager, options);

      updateUrl({ new: "data" });

      expect(stringifyData).toHaveBeenCalledWith({
        app: { new: "data" },
      });
    });
  });

  describe("URL length validation", () => {
    it("should warn and not update when URL exceeds maxUrlLength", () => {
      const currentUrl = new URL("https://example.com/");
      mockUrlManager.getUrl = vi.fn().mockReturnValue(currentUrl);
      vi.mocked(stringifyData).mockReturnValue("a".repeat(2000)); // Long query string

      const options: QueryStringDriverOptions = { maxUrlLength: 50 };
      const updateUrl = createUrlUpdater(mockUrlManager, options);

      updateUrl({ data: "value" });

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        expect.stringContaining("URL length")
      );
      expect(mockUrlManager.updateInternalUrl).not.toHaveBeenCalled();
    });

    it("should update when URL is within maxUrlLength", () => {
      const currentUrl = new URL("https://example.com/");
      mockUrlManager.getUrl = vi.fn().mockReturnValue(currentUrl);
      vi.mocked(stringifyData).mockReturnValue("foo=bar");

      const options: QueryStringDriverOptions = { maxUrlLength: 2000, url: "https://example.com/" };
      const updateUrl = createUrlUpdater(mockUrlManager, options);

      updateUrl({ foo: "bar" });

      expect(mockConsoleWarn).not.toHaveBeenCalled();
      expect(mockUrlManager.updateInternalUrl).toHaveBeenCalled();
    });
  });

  describe("browser history integration", () => {
    it("should update browser history with pushState when enabled", () => {
      const mockHistory = {
        pushState: vi.fn(),
        replaceState: vi.fn(),
      };
      Object.defineProperty(global, 'window', {
        value: {
          location: { href: "https://example.com/" },
          history: mockHistory
        },
        configurable: true
      });

      const currentUrl = new URL("https://example.com/");
      mockUrlManager.getUrl = vi.fn().mockReturnValue(currentUrl);
      vi.mocked(stringifyData).mockReturnValue("foo=bar");

      const options: QueryStringDriverOptions = {
        updateHistory: true,
        historyMethod: "pushState",
      };
      const updateUrl = createUrlUpdater(mockUrlManager, options);

      updateUrl({ foo: "bar" });

      expect(mockHistory.pushState).toHaveBeenCalledWith(
        null,
        "",
        "https://example.com/?foo=bar"
      );
    });

    it("should update browser history with replaceState when configured", () => {
      const mockHistory = {
        pushState: vi.fn(),
        replaceState: vi.fn(),
      };
      Object.defineProperty(global, 'window', {
        value: {
          location: { href: "https://example.com/" },
          history: mockHistory
        },
        configurable: true
      });

      const currentUrl = new URL("https://example.com/");
      mockUrlManager.getUrl = vi.fn().mockReturnValue(currentUrl);
      vi.mocked(stringifyData).mockReturnValue("foo=bar");

      const options: QueryStringDriverOptions = {
        updateHistory: true,
        historyMethod: "replaceState",
      };
      const updateUrl = createUrlUpdater(mockUrlManager, options);

      updateUrl({ foo: "bar" });

      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        null,
        "",
        "https://example.com/?foo=bar"
      );
    });

    it("should not update browser history when updateHistory is false", () => {
      const mockHistory = {
        pushState: vi.fn(),
        replaceState: vi.fn(),
      };
      Object.defineProperty(global, 'window', {
        value: {
          location: { href: "https://example.com/" },
          history: mockHistory
        },
        configurable: true
      });

      const currentUrl = new URL("https://example.com/");
      mockUrlManager.getUrl = vi.fn().mockReturnValue(currentUrl);
      vi.mocked(stringifyData).mockReturnValue("foo=bar");

      const options: QueryStringDriverOptions = { updateHistory: false };
      const updateUrl = createUrlUpdater(mockUrlManager, options);

      updateUrl({ foo: "bar" });

      expect(mockHistory.pushState).not.toHaveBeenCalled();
      expect(mockHistory.replaceState).not.toHaveBeenCalled();
    });

    it("should not update browser history when custom URL is provided", () => {
      const mockHistory = {
        pushState: vi.fn(),
        replaceState: vi.fn(),
      };
      Object.defineProperty(global, 'window', {
        value: {
          location: { href: "https://example.com/" },
          history: mockHistory
        },
        configurable: true
      });

      const currentUrl = new URL("https://custom.com/");
      mockUrlManager.getUrl = vi.fn().mockReturnValue(currentUrl);
      vi.mocked(stringifyData).mockReturnValue("foo=bar");

      const options: QueryStringDriverOptions = {
        url: "https://custom.com/",
        updateHistory: true,
      };
      const updateUrl = createUrlUpdater(mockUrlManager, options);

      updateUrl({ foo: "bar" });

      expect(mockHistory.pushState).not.toHaveBeenCalled();
      expect(mockHistory.replaceState).not.toHaveBeenCalled();
    });
  });
});