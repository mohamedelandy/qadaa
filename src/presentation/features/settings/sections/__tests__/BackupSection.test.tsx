/** @format */
import { render, screen, userEvent } from "@testing-library/react-native";
import { ThemeProvider } from "@theme/ThemeProvider";
import { BackupSection } from "../BackupSection";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "en" } }),
}));

jest.useFakeTimers();

describe("BackupSection", () => {
  it("calls onOpenSync when sync button is pressed", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onOpenSync = jest.fn();
    const onExport = jest.fn().mockResolvedValue(true);
    const onImport = jest.fn().mockResolvedValue(true);

    await render(
      <ThemeProvider>
        <BackupSection onOpenSync={onOpenSync} onExport={onExport} onImport={onImport} />
      </ThemeProvider>
    );

    await user.press(screen.getByTestId("settings-sync-btn"));
    expect(onOpenSync).toHaveBeenCalledTimes(1);
  });

  it("calls onExport when export button is pressed", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onOpenSync = jest.fn();
    const onExport = jest.fn().mockResolvedValue(true);
    const onImport = jest.fn().mockResolvedValue(true);

    await render(
      <ThemeProvider>
        <BackupSection onOpenSync={onOpenSync} onExport={onExport} onImport={onImport} />
      </ThemeProvider>
    );

    await user.press(screen.getByTestId("settings-backup-export-btn"));
    expect(onExport).toHaveBeenCalledTimes(1);
  });

  it("calls onImport when import button is pressed", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onOpenSync = jest.fn();
    const onExport = jest.fn().mockResolvedValue(true);
    const onImport = jest.fn().mockResolvedValue(true);

    await render(
      <ThemeProvider>
        <BackupSection onOpenSync={onOpenSync} onExport={onExport} onImport={onImport} />
      </ThemeProvider>
    );

    await user.press(screen.getByTestId("settings-backup-import-btn"));
    expect(onImport).toHaveBeenCalledTimes(1);
  });
});
