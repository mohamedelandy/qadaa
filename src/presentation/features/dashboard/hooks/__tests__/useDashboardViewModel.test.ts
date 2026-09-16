import { renderHook } from "@testing-library/react-native";
import { useDashboardViewModel } from "../useDashboardViewModel";

jest.mock("@hooks/useUI", () => ({
  useUI: jest.fn(),
}));

jest.mock("../useDashboardPrayerData", () => ({
  useDashboardPrayerData: jest.fn(),
}));

jest.mock("../useDashboardStreak", () => ({
  useDashboardStreak: jest.fn(),
}));

jest.mock("../useDashboardCalendar", () => ({
  useDashboardCalendar: jest.fn(),
}));

jest.mock("../useDashboardOverlays", () => ({
  useDashboardOverlays: jest.fn(),
}));

jest.mock("../useDashboardActions", () => ({
  useDashboardActions: jest.fn(),
}));

jest.mock("../useDashboardStyles", () => ({
  useDashboardStyles: jest.fn(),
}));

import { useUI } from "@hooks/useUI";
import { useDashboardPrayerData } from "../useDashboardPrayerData";
import { useDashboardStreak } from "../useDashboardStreak";
import { useDashboardCalendar } from "../useDashboardCalendar";
import { useDashboardOverlays } from "../useDashboardOverlays";
import { useDashboardActions } from "../useDashboardActions";
import { useDashboardStyles } from "../useDashboardStyles";

describe("useDashboardViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should compose and return data from all sub-hooks", async () => {
    // Setup mocks
    (useUI as jest.Mock).mockReturnValue({
      t: jest.fn((key) => `translated_${key}`),
      colors: { primary: "#000" },
    });

    (useDashboardPrayerData as jest.Mock).mockReturnValue({
      prayerRows: [{ name: "Fajr", isDone: true }],
      allPrayersDone: false,
      todayData: { date: "2023-01-01" },
    });

    (useDashboardStreak as jest.Mock).mockReturnValue({
      streakData: { current: 5, isAtRisk: false },
    });

    (useDashboardCalendar as jest.Mock).mockReturnValue({
      weeklyGridData: [{ day: "Mon" }],
      hadithData: { text: "Some hadith" },
    });

    (useDashboardOverlays as jest.Mock).mockReturnValue({
      showIntention: true,
      showDua: false,
    });

    const mockActions = { logPrayer: jest.fn() };
    (useDashboardActions as jest.Mock).mockReturnValue({
      actions: mockActions,
    });

    (useDashboardStyles as jest.Mock).mockReturnValue({
      styles: { container: {} },
      gradients: { background: ["#fff", "#000"] },
    });

    const { result } = await renderHook(() => useDashboardViewModel());

    expect(result.current.t).toBeDefined();
    expect(result.current.colors).toEqual({ primary: "#000" });
    expect(result.current.prayerRows).toEqual([{ name: "Fajr", isDone: true }]);
    expect(result.current.allPrayersDone).toBe(false);
    expect(result.current.todayData).toEqual({ date: "2023-01-01" });
    expect(result.current.streakData).toEqual({ current: 5, isAtRisk: false });
    expect(result.current.weeklyGridData).toEqual([{ day: "Mon" }]);
    expect(result.current.hadithData).toEqual({ text: "Some hadith" });
    expect(result.current.overlays).toEqual({ showIntention: true, showDua: false });
    expect(result.current.actions).toBe(mockActions);
    expect(result.current.styles).toEqual({ container: {} });
    expect(result.current.gradients).toEqual({ background: ["#fff", "#000"] });
  });
});
