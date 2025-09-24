import { describe, it, expect, vi, beforeEach } from "vitest";
import { createQueryStringDriver } from "./core-driver";
import { createUrlManager } from "./url-manager";
import { createDataManager } from "./data-manager";
import { createStorageHandler } from "./storage-handler";

// Mock all dependencies
vi.mock("./url-manager", () => ({
  createUrlManager: vi.fn(),
}));

vi.mock("./data-manager", () => ({
  createDataManager: vi.fn(),
}));

vi.mock("./storage-handler", () => ({
  createStorageHandler: vi.fn(),
}));

describe("Core Driver", () => {
  let mockUrlManager: { getUrl: vi.Mock, updateInternalUrl: vi.Mock };
  let mockDataManager: { getCurrentData: vi.Mock };
  let mockStorageHandler: {
    hasItem: vi.Mock,
    getItem: vi.Mock,
    getItemRaw: vi.Mock,
    setItem: vi.Mock,
    removeItem: vi.Mock,
    getKeys: vi.Mock,
    clear: vi.Mock,
    dispose: vi.Mock
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockUrlManager = { getUrl: vi.fn(), updateInternalUrl: vi.fn() };
    mockDataManager = { getCurrentData: vi.fn() };
    mockStorageHandler = {
      hasItem: vi.fn(),
      getItem: vi.fn(),
      getItemRaw: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      getKeys: vi.fn(),
      clear: vi.fn(),
      dispose: vi.fn(),
    };

    vi.mocked(createUrlManager).mockReturnValue(mockUrlManager);
    vi.mocked(createDataManager).mockReturnValue(mockDataManager);
    vi.mocked(createStorageHandler).mockReturnValue(mockStorageHandler);
  });

  it("should create driver with default options", () => {
    const driver = createQueryStringDriver();

    expect(createUrlManager).toHaveBeenCalledWith({});
    expect(createDataManager).toHaveBeenCalledWith(mockUrlManager);
    expect(createStorageHandler).toHaveBeenCalledWith(mockDataManager, mockUrlManager, {});

    expect(driver.name).toBe("query-string");
    expect(driver.options).toEqual({});
  });

  it("should create driver with custom options", () => {
    const options = {
      base: "app",
      updateHistory: false,
      maxUrlLength: 1000,
    };

    const driver = createQueryStringDriver(options);

    expect(createUrlManager).toHaveBeenCalledWith(options);
    expect(createDataManager).toHaveBeenCalledWith(mockUrlManager);
    expect(createStorageHandler).toHaveBeenCalledWith(mockDataManager, mockUrlManager, options);

    expect(driver.name).toBe("query-string");
    expect(driver.options).toEqual(options);
  });

  it("should include all storage handler methods", () => {
    const driver = createQueryStringDriver();

    expect(driver).toHaveProperty("hasItem", mockStorageHandler.hasItem);
    expect(driver).toHaveProperty("getItem", mockStorageHandler.getItem);
    expect(driver).toHaveProperty("getItemRaw", mockStorageHandler.getItemRaw);
    expect(driver).toHaveProperty("setItem", mockStorageHandler.setItem);
    expect(driver).toHaveProperty("removeItem", mockStorageHandler.removeItem);
    expect(driver).toHaveProperty("getKeys", mockStorageHandler.getKeys);
    expect(driver).toHaveProperty("clear", mockStorageHandler.clear);
    expect(driver).toHaveProperty("dispose", mockStorageHandler.dispose);
  });

  it("should pass managers correctly through the chain", () => {
    const options = { base: "test" };
    createQueryStringDriver(options);

    expect(createUrlManager).toHaveBeenCalledWith(options);
    expect(createDataManager).toHaveBeenCalledWith(mockUrlManager);
    expect(createStorageHandler).toHaveBeenCalledWith(mockDataManager, mockUrlManager, options);
  });
});