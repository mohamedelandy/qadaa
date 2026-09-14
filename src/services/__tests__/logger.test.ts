import { Logger } from "../logger";

describe("Logger", () => {
  beforeEach(() => {
    jest.spyOn(console, "debug").mockImplementation();
    jest.spyOn(console, "info").mockImplementation();
    jest.spyOn(console, "warn").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should not log debug in production", () => {
    Object.defineProperty(global, "__DEV__", { value: false, configurable: true });
    Logger.debug("test");
    // eslint-disable-next-line no-console
    expect(console.debug).not.toHaveBeenCalled();
    Object.defineProperty(global, "__DEV__", { value: true, configurable: true });
  });

  it("should log info", () => {
    Logger.info("test info");
    // eslint-disable-next-line no-console
    expect(console.info).toHaveBeenCalledWith(
      JSON.stringify({ level: "info", message: "test info" })
    );
  });

  it("should log warn", () => {
    Logger.warn("test warn", { context: 1 });
    expect(console.warn).toHaveBeenCalledWith(
      JSON.stringify({ level: "warn", message: "test warn", context: 1 })
    );
  });

  it("should log error", () => {
    Logger.error("test error", new Error("msg"));
    expect(console.error).toHaveBeenCalled();
  });
});
