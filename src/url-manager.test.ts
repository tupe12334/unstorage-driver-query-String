import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createUrlManager } from "./url-manager";
import { QueryStringDriverError } from "./errors";
import validator from "validator";
import invariant from "tiny-invariant";

// Mock validator
vi.mock("validator", () => ({
  default: {
    isURL: vi.fn(),
  },
}));

// Mock tiny-invariant
vi.mock("tiny-invariant", () => ({
  default: vi.fn(),
}));

describe("URL Manager", () => {
  let originalWindow: typeof global.window;

  beforeEach(() => {
    vi.clearAllMocks();
    originalWindow = global.window;
    vi.mocked(invariant).mockImplementation((condition, message) => {
      if (!condition) {
        throw new QueryStringDriverError(message || "Invariant failed");
      }
    });
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  describe("getUrl", () => {
    it("should return URL object when valid absolute URL is provided", () => {
      vi.mocked(validator.isURL).mockReturnValue(true);
      const urlManager = createUrlManager({ url: "https://example.com/path?foo=bar" });

      const result = urlManager.getUrl();

      expect(result).toBeInstanceOf(URL);
      expect(result.href).toBe("https://example.com/path?foo=bar");
    });

    it("should handle relative URL with window.location", () => {
      vi.mocked(validator.isURL).mockReturnValue(false);
      Object.defineProperty(global, 'window', {
        value: {
          location: { origin: "https://example.com" }
        },
        configurable: true
      });

      const urlManager = createUrlManager({ url: "/path?foo=bar" });

      const result = urlManager.getUrl();

      expect(result).toBeInstanceOf(URL);
      expect(result.href).toBe("https://example.com/path?foo=bar");
    });

    it("should throw error for relative URL in non-browser environment", () => {
      vi.mocked(validator.isURL).mockReturnValue(false);
      Object.defineProperty(global, 'window', {
        value: undefined,
        configurable: true
      });

      const urlManager = createUrlManager({ url: "/path" });

      expect(() => urlManager.getUrl()).toThrow(QueryStringDriverError);
      expect(() => urlManager.getUrl()).toThrow("Cannot resolve relative URL in non-browser environment");
    });

    it("should throw error for invalid URL", () => {
      vi.mocked(validator.isURL).mockReturnValue(true);
      const urlManager = createUrlManager({ url: "invalid-url" });

      // Mock URL constructor to throw
      const originalURL = global.URL;
      Object.defineProperty(global, 'URL', {
        value: class extends originalURL {
          constructor(url: string) {
            if (url === "invalid-url") {
              throw new QueryStringDriverError("Invalid URL");
            }
            super(url);
          }
        },
        configurable: true
      });

      expect(() => urlManager.getUrl()).toThrow(QueryStringDriverError);
      expect(() => urlManager.getUrl()).toThrow("Invalid URL: invalid-url");

      Object.defineProperty(global, 'URL', {
        value: originalURL,
        configurable: true
      });
    });

    it("should return window.location.href when no URL provided in browser", () => {
      Object.defineProperty(global, 'window', {
        value: {
          location: { href: "https://current-page.com/path?existing=param" }
        },
        configurable: true
      });

      const urlManager = createUrlManager({});

      const result = urlManager.getUrl();

      expect(result).toBeInstanceOf(URL);
      expect(result.href).toBe("https://current-page.com/path?existing=param");
    });

    it("should throw error when no URL provided in non-browser environment", () => {
      Object.defineProperty(global, 'window', {
        value: undefined,
        configurable: true
      });

      const urlManager = createUrlManager({});

      expect(() => urlManager.getUrl()).toThrow(QueryStringDriverError);
      expect(() => urlManager.getUrl()).toThrow("URL is required in non-browser environment");
    });

    it("should cache and return the same URL instance on subsequent calls", () => {
      vi.mocked(validator.isURL).mockReturnValue(true);
      const urlManager = createUrlManager({ url: "https://example.com" });

      const result1 = urlManager.getUrl();
      const result2 = urlManager.getUrl();

      expect(result1).toBe(result2);
    });
  });

  describe("updateInternalUrl", () => {
    it("should update internal URL when custom URL is provided", () => {
      vi.mocked(validator.isURL).mockReturnValue(true);
      const urlManager = createUrlManager({ url: "https://example.com" });

      const newUrl = new URL("https://example.com/updated?param=value");
      urlManager.updateInternalUrl(newUrl);

      const result = urlManager.getUrl();
      expect(result).toBe(newUrl);
    });

    it("should not update internal URL when no custom URL provided", () => {
      Object.defineProperty(global, 'window', {
        value: {
          location: { href: "https://current-page.com/path" }
        },
        configurable: true
      });

      const urlManager = createUrlManager({});
      const originalUrl = urlManager.getUrl();

      const newUrl = new URL("https://example.com/updated");
      urlManager.updateInternalUrl(newUrl);

      // Should still return window.location.href since no custom URL was provided
      const result = urlManager.getUrl();
      expect(result.href).toBe("https://current-page.com/path");
    });
  });
});