import { createPrayerRowStyles, BTN_SIZE } from "../PrayerRow.styles";

describe("createPrayerRowStyles", () => {
  const mockColors = {
    border: "#border",
    card: "#card",
    cardDim: "#cardDim",
    text: "#text",
    green: "#green",
    greenSurface: "#greenSurface",
    greenBorder: "#greenBorder",
    greenSubtle: "#greenSubtle",
    amber: "#amber",
    textMuted: "#textMuted",
    textDim: "#textDim",
    white: "#white",
    primary: "#primary",
    primaryGlow: "#primaryGlow",
    primaryGlowBg: ["#primaryGlowBg"],
    primaryGlowBorder: "#primaryGlowBorder",
    borderStrong: "#borderStrong",
  };

  const mockTypography = {
    fontSize: { xs: 10, sm: 12, base: 14, lg: 16, xl: 20 },
    fonts: { medium: "font-medium", bold: "font-bold" },
  };

  const mockBorderRadius = { full: 9999, xl: 16 };

  it("returns styles for LTR", () => {
    const styles = createPrayerRowStyles({
      colors: mockColors,
      typography: mockTypography,
      borderRadius: mockBorderRadius,
      isRTL: false,
    });

    expect(styles.container.backgroundColor).toBe(mockColors.card);
    expect(styles.prayerName.writingDirection).toBe("ltr");
    expect(styles.progressLabel.textAlign).toBe("right");
  });

  it("returns styles for RTL", () => {
    const styles = createPrayerRowStyles({
      colors: mockColors,
      typography: mockTypography,
      borderRadius: mockBorderRadius,
      isRTL: true,
    });

    expect(styles.prayerName.writingDirection).toBe("rtl");
    expect(styles.progressLabel.textAlign).toBe("left");
  });

  it("contains specific constants like BTN_SIZE", () => {
    expect(BTN_SIZE).toBe(44);
  });
});
