/** @format */
/**
 * Unit tests for the AsyncStorage adapter delegation.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { asyncStorageAdapter } from "../storage/storage";
describe("asyncStorageAdapter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("getItem delegates to AsyncStorage.getItem", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("value");
    const result = await asyncStorageAdapter.getItem("key");
    expect(AsyncStorage.getItem).toHaveBeenCalledWith("key");
    expect(result).toBe("value");
  });
  it("setItem delegates to AsyncStorage.setItem", async () => {
    await asyncStorageAdapter.setItem("key", "value");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("key", "value");
  });
  it("removeItem delegates to AsyncStorage.removeItem", async () => {
    await asyncStorageAdapter.removeItem("key");
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("key");
  });
});
