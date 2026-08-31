/** @format */
/**
 * Thin async adapter over AsyncStorage for Zustand persistence.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
export const asyncStorageAdapter = {
  getItem: async (name: string) => AsyncStorage.getItem(name),
  setItem: async (name: string, value: string) => AsyncStorage.setItem(name, value),
  removeItem: async (name: string) => AsyncStorage.removeItem(name),
};
