import { renderHook } from "@testing-library/react-native";
import { useTimeouts } from "../useTimeouts";

describe("useTimeouts", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("should provide register and unregister functions", async () => {
    const { result } = await renderHook(() => useTimeouts());
    expect(typeof result.current.register).toBe("function");
    expect(typeof result.current.unregister).toBe("function");
  });
});
