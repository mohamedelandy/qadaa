/** @format */
/**
 * Unit tests for installDefaultTextFonts applying the default font to RN text components.
 */
import { Text, TextInput } from "react-native";
import { installDefaultTextFonts } from "../textDefaults";

describe("installDefaultTextFonts", () => {
  it("applies the default font family to Text and TextInput", () => {
    installDefaultTextFonts();
    const textDefaults = (Text as unknown as { defaultProps?: { style?: unknown } }).defaultProps;
    const inputDefaults = (TextInput as unknown as { defaultProps?: { style?: unknown } })
      .defaultProps;
    expect(textDefaults?.style).toMatchObject({ fontFamily: "Tajawal-Regular" });
    expect(inputDefaults?.style).toMatchObject({ fontFamily: "Tajawal-Regular" });
  });

  it("is idempotent across repeated calls", () => {
    installDefaultTextFonts();
    installDefaultTextFonts();
    const textDefaults = (Text as unknown as { defaultProps?: { style?: unknown } }).defaultProps;
    expect(textDefaults?.style).toMatchObject({ fontFamily: "Tajawal-Regular" });
  });
});
