import { createBatchLogPopoverStyles, createBatchLogSheetStyles } from "../BatchLogPopover.styles";

describe("BatchLogPopover Styles", () => {
  const mockTokens = {
    colors: {
      scrim: "rgba(0, 0, 0, 0.5)",
      card: "#ffffff",
      borderStrong: "#e5e7eb",
      shadow: "#000000",
      textDim: "#6b7280",
      primary: "#3b82f6",
      white: "#ffffff",
      surfaceAlt: "#f3f4f6",
      surface: "#ffffff",
      text: "#111827",
      textMuted: "#9ca3af",
      textSub: "#4b5563",
      textPlaceholder: "#9ca3af",
    },
    typography: {
      fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
      },
      fonts: {
        regular: "Inter-Regular",
        medium: "Inter-Medium",
        bold: "Inter-Bold",
      },
    },
    borderRadius: {
      lg: 8,
      xl: 12,
    },
  };

  describe("createBatchLogPopoverStyles", () => {
    it("should create styles based on provided tokens", () => {
      const styles = createBatchLogPopoverStyles(mockTokens);

      // Verify specific style mappings
      expect(styles.backdrop.backgroundColor).toBe(mockTokens.colors.scrim);
      expect(styles.container.backgroundColor).toBe(mockTokens.colors.card);
      expect(styles.container.borderColor).toBe(mockTokens.colors.borderStrong);
      expect(styles.container.borderRadius).toBe(mockTokens.borderRadius.xl);
      expect(styles.container.shadowColor).toBe(mockTokens.colors.shadow);

      expect(styles.title.color).toBe(mockTokens.colors.textDim);
      expect(styles.title.fontSize).toBe(mockTokens.typography.fontSize.base);
      expect(styles.title.fontFamily).toBe(mockTokens.typography.fonts.bold);

      expect(styles.presetBtn.backgroundColor).toBe(mockTokens.colors.primary);
      expect(styles.presetBtn.borderRadius).toBe(mockTokens.borderRadius.lg);

      expect(styles.presetText.color).toBe(mockTokens.colors.white);
      expect(styles.presetText.fontFamily).toBe(mockTokens.typography.fonts.bold);

      expect(styles.customBtn.backgroundColor).toBe(mockTokens.colors.surfaceAlt);

      expect(styles.input.backgroundColor).toBe(mockTokens.colors.surface);
      expect(styles.input.color).toBe(mockTokens.colors.text);
      expect(styles.input.borderRadius).toBe(mockTokens.borderRadius.lg);
      expect(styles.input.fontSize).toBe(mockTokens.typography.fontSize.sm);
    });
  });

  describe("createBatchLogSheetStyles", () => {
    it("should create styles based on provided tokens", () => {
      const styles = createBatchLogSheetStyles(mockTokens);

      // Verify specific style mappings
      expect(styles.title.color).toBe(mockTokens.colors.textSub);
      expect(styles.title.fontSize).toBe(mockTokens.typography.fontSize.base);
      expect(styles.title.fontFamily).toBe(mockTokens.typography.fonts.bold);

      expect(styles.input.backgroundColor).toBe(mockTokens.colors.surface);
      expect(styles.input.color).toBe(mockTokens.colors.text);
      expect(styles.input.borderRadius).toBe(mockTokens.borderRadius.lg);
      expect(styles.input.borderColor).toBe(mockTokens.colors.borderStrong);
      expect(styles.input.fontSize).toBe(mockTokens.typography.fontSize.base);
      expect(styles.input.fontFamily).toBe(mockTokens.typography.fonts.regular);

      expect(styles.cancelText.color).toBe(mockTokens.colors.textMuted);
      expect(styles.cancelText.fontSize).toBe(mockTokens.typography.fontSize.base);
      expect(styles.cancelText.fontFamily).toBe(mockTokens.typography.fonts.bold);
    });
  });
});
