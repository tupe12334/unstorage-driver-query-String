import { describe, it, expect, vi, beforeEach } from "vitest";
import { createStorageHandler } from "./storage-handler";
import type { DataManager } from "./data-manager-interface";
import type { UrlManager } from "./url-manager-interface";
import type { QueryStringDriverOptions } from "./types";
import { createUrlUpdater } from "./url-updater";
import { createStorageOperations } from "./storage-operations";

// Mock dependencies
vi.mock("./url-updater", () => ({
  createUrlUpdater: vi.fn(),
}));

vi.mock("./storage-operations", () => ({
  createStorageOperations: vi.fn(),
}));

describe("Storage Handler", () => {
  let mockDataManager: DataManager;
  let mockUrlManager: UrlManager;
  let mockUpdateUrl: vi.Mock;
  let mockOperations: ReturnType<typeof createStorageOperations>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockDataManager = {
      getCurrentData: vi.fn(),
    };

    mockUrlManager = {
      getUrl: vi.fn(),
      updateInternalUrl: vi.fn(),
    };

    mockUpdateUrl = vi.fn();
    vi.mocked(createUrlUpdater).mockReturnValue(mockUpdateUrl);

    mockOperations = {
      hasItem: vi.fn(),
      getItem: vi.fn(),
      getItemRaw: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      getKeys: vi.fn(),
      clear: vi.fn(),
    };
    vi.mocked(createStorageOperations).mockReturnValue(mockOperations);
  });

  it("should create storage handler with all required methods", () => {
    const options: QueryStringDriverOptions = { base: "test" };
    const handler = createStorageHandler(mockDataManager, mockUrlManager, options);

    expect(createUrlUpdater).toHaveBeenCalledWith(mockUrlManager, options);
    expect(createStorageOperations).toHaveBeenCalledWith(mockDataManager, mockUpdateUrl, "test");

    expect(handler).toHaveProperty("hasItem");
    expect(handler).toHaveProperty("getItem");
    expect(handler).toHaveProperty("getItemRaw");
    expect(handler).toHaveProperty("setItem");
    expect(handler).toHaveProperty("removeItem");
    expect(handler).toHaveProperty("getKeys");
    expect(handler).toHaveProperty("clear");
    expect(handler).toHaveProperty("dispose");
  });

  it("should use empty string as default base", () => {
    const options: QueryStringDriverOptions = {};
    createStorageHandler(mockDataManager, mockUrlManager, options);

    expect(createStorageOperations).toHaveBeenCalledWith(mockDataManager, mockUpdateUrl, "");
  });

  it("should delegate hasItem to operations", () => {
    const handler = createStorageHandler(mockDataManager, mockUrlManager, {});
    mockOperations.hasItem.mockReturnValue(true);

    const result = handler.hasItem("test", {});

    expect(mockOperations.hasItem).toHaveBeenCalledWith("test", {});
    expect(result).toBe(true);
  });

  it("should delegate getItem to operations", () => {
    const handler = createStorageHandler(mockDataManager, mockUrlManager, {});
    mockOperations.getItem.mockReturnValue("value");

    const result = handler.getItem("test", {});

    expect(mockOperations.getItem).toHaveBeenCalledWith("test", {});
    expect(result).toBe("value");
  });

  it("should delegate getItemRaw to operations", () => {
    const handler = createStorageHandler(mockDataManager, mockUrlManager, {});
    mockOperations.getItemRaw.mockReturnValue("raw-value");

    const result = handler.getItemRaw("test", {});

    expect(mockOperations.getItemRaw).toHaveBeenCalledWith("test", {});
    expect(result).toBe("raw-value");
  });

  it("should delegate setItem to operations", async () => {
    const handler = createStorageHandler(mockDataManager, mockUrlManager, {});
    mockOperations.setItem.mockResolvedValue(undefined);

    await handler.setItem("test", "value", {});

    expect(mockOperations.setItem).toHaveBeenCalledWith("test", "value", {});
  });

  it("should delegate removeItem to operations", async () => {
    const handler = createStorageHandler(mockDataManager, mockUrlManager, {});
    mockOperations.removeItem.mockResolvedValue(undefined);

    await handler.removeItem("test", {});

    expect(mockOperations.removeItem).toHaveBeenCalledWith("test", {});
  });

  it("should delegate getKeys to operations", () => {
    const handler = createStorageHandler(mockDataManager, mockUrlManager, {});
    mockOperations.getKeys.mockReturnValue(["key1", "key2"]);

    const result = handler.getKeys("", {});

    expect(mockOperations.getKeys).toHaveBeenCalledWith("", {});
    expect(result).toEqual(["key1", "key2"]);
  });

  it("should delegate clear to operations", async () => {
    const handler = createStorageHandler(mockDataManager, mockUrlManager, {});
    mockOperations.clear.mockResolvedValue(undefined);

    await handler.clear("", {});

    expect(mockOperations.clear).toHaveBeenCalledWith("", {});
  });

  it("should provide dispose method that resolves", async () => {
    const handler = createStorageHandler(mockDataManager, mockUrlManager, {});

    const result = await handler.dispose();

    expect(result).toBeUndefined();
  });
});