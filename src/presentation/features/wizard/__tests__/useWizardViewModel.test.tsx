/** @format */
/**
 * Unit tests for wizard view-model hook: form state, validation gating, and completion side effects.
 */
import { screen, userEvent } from "@testing-library/react-native";
import { View, Pressable } from "react-native";
import { renderWithProviders } from "@/src/__tests__/testUtils";

const user = userEvent.setup();
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "en" } }),
}));
jest.mock("react-hook-form", () => {
  const mockControl = {};
  const mockStep2Control = {};
  return {
    Controller: ({ render }: { render: (props: unknown) => unknown }) =>
      render({
        field: { onChange: jest.fn(), value: "" },
        fieldState: {},
      }),
    useForm: () => ({
      control: mockControl,
      formState: { errors: {} },
      trigger: jest.fn(),
      clearErrors: jest.fn(),
      setValue: jest.fn(),
      reset: jest.fn(),
      watch: jest.fn(),
      handleSubmit: jest.fn(),
    }),
    useFormContext: () => ({
      control: mockStep2Control,
      formState: { errors: {} },
    }),
  };
});
jest.mock("@stores/usePrayerStore", () => {
  const mockStore = {
    completeWizard: jest.fn(),
  };
  const usePrayerStore = jest.fn((selector) => selector(mockStore));
  Object.assign(usePrayerStore, {
    getState: () => mockStore,
    setState: jest.fn(),
    getInitialState: () => mockStore,
    subscribe: jest.fn((cb) => cb(mockStore)),
  });
  return { usePrayerStore };
});
jest.mock("@stores/useSettingsStore", () => {
  const mockStore = {
    setDailyTarget: jest.fn(),
  };
  const useSettingsStore = jest.fn((selector) => selector(mockStore));
  Object.assign(useSettingsStore, {
    getState: () => mockStore,
    setState: jest.fn(),
    getInitialState: () => mockStore,
    subscribe: jest.fn((cb) => cb(mockStore)),
  });
  return { useSettingsStore };
});
jest.mock("@stores/useAppStore", () => {
  const mockStore = {
    completeWizard: jest.fn(),
  };
  const useAppStore = jest.fn((selector) => selector(mockStore));
  Object.assign(useAppStore, {
    getState: () => mockStore,
    setState: jest.fn(),
    getInitialState: () => mockStore,
    subscribe: jest.fn((cb) => cb(mockStore)),
  });
  return { useAppStore };
});
jest.mock("@stores/useThemeStore", () => {
  const mockStore = {
    mode: "light",
    direction: "rtl",
    setMode: jest.fn(),
    setDirection: jest.fn(),
    toggleTheme: jest.fn(),
  };
  const useThemeStore = jest.fn((selector) => selector(mockStore));
  Object.assign(useThemeStore, {
    getState: () => mockStore,
    setState: jest.fn(),
    getInitialState: () => mockStore,
    subscribe: jest.fn((cb) => cb(mockStore)),
  });
  return { useThemeStore };
});
import { useWizardStore } from "@stores/useWizardStore";
import { useWizardViewModel } from "../hooks/useWizardViewModel";
const LINES: string[] = [];
function Harness() {
  const vm = useWizardViewModel();
  return (
    <View>
      <Pressable
        testID="trace"
        onPress={() => {
          const traceOutput = `qY=${vm.quickYears} adv=${vm.advanced} pLen=${vm.periods.length} p0T=${vm.periods[0]?.type} p0Y=${vm.periods[0]?.years} p1T=${vm.periods[1]?.type} p1Y=${vm.periods[1]?.years} step2V=${String(vm.step2Valid)} canAdd=${String(vm.canAddPeriod)} missed=${vm.totalMissedDays} er2=${vm.step2Error} dt=${vm.dailyTarget} ct=${vm.customTarget} step3V=${String(vm.step3Valid)} nextDis=${String(vm.isNextDisabled)} er3=${vm.step3Error}`;
          LINES.push(traceOutput);
        }}
      />
      <Pressable testID="qy5" onPress={() => vm.setQuickYears("5")} />
      <Pressable testID="qy50" onPress={() => vm.setQuickYears("50")} />
      <Pressable testID="qy1" onPress={() => vm.setQuickYears("1")} />
      <Pressable testID="qy2" onPress={() => vm.setQuickYears("2")} />
      <Pressable testID="qy0" onPress={() => vm.setQuickYears("0")} />
      <Pressable testID="qy14" onPress={() => vm.setQuickYears("14")} />
      <Pressable testID="tog" onPress={() => vm.toggleAdvanced()} />
      <Pressable testID="addP" onPress={() => vm.addPeriod()} />
      <Pressable testID="rmP0" onPress={() => vm.removePeriod(0)} />
      <Pressable testID="upP0" onPress={() => vm.updatePeriod(0, "type", "regular")} />
      <Pressable testID="upP1" onPress={() => vm.updatePeriod(1, "type", "regular")} />
      <Pressable testID="setP0Y" onPress={() => vm.updatePeriod(0, "years", "3.5")} />
      <Pressable testID="setP0Y15" onPress={() => vm.updatePeriod(0, "years", "15")} />
      <Pressable testID="setP1Y" onPress={() => vm.updatePeriod(1, "years", "1.5")} />
      <Pressable testID="customOn" onPress={() => vm.setCustom()} />
      <Pressable testID="set50" onPress={() => vm.setCustomTarget("50")} />
      <Pressable testID="set51" onPress={() => vm.setCustomTarget("51")} />
      <Pressable testID="clear" onPress={() => vm.setCustomTarget("")} />
      <Pressable testID="setAge28" onPress={() => vm.setAge("28")} />
      <Pressable testID="setPuberty14" onPress={() => vm.setPubertyAge("14")} />
    </View>
  );
}
async function press(id: string) {
  await user.press(screen.getByTestId(id));
  await new Promise((r) => setTimeout(r, 100));
}
async function setupWizard() {
  jest.clearAllMocks();
  await press("setAge28");
  await press("setPuberty14");
}
beforeEach(() => {
  LINES.length = 0;
  jest.clearAllMocks();
  useWizardStore.getState().resetAll();
});
describe("useWizardViewModel step3 custom pace", () => {
  it("enables Next when a valid custom pace is entered", async () => {
    await renderWithProviders(<Harness />);
    await press("customOn");
    await press("set50");
    await press("trace");
    expect(vmTrace(LINES, "step3V")).toBe("true");
  });
  it("keeps Next disabled when custom pace is out of range", async () => {
    await renderWithProviders(<Harness />);
    LINES.length = 0;
    await press("customOn");
    await press("set51");
    await press("trace");
    expect(vmTrace(LINES, "step3V")).toBe("false");
    expect(LINES[0]).toContain("custom.range");
  });
  it("keeps Next disabled when custom pace is empty", async () => {
    await renderWithProviders(<Harness />);
    LINES.length = 0;
    await press("customOn");
    await press("clear");
    await press("trace");
    expect(vmTrace(LINES, "step3V")).toBe("false");
    expect(LINES[0]).toContain("custom.required");
  });
});
function vmTrace(lines: string[], key: string) {
  const match = lines[0]?.match(new RegExp(`${key}=(\\S+)`));
  return match?.[1] ?? "";
}
function step2Trace(lines: string[], key: string) {
  const regex = new RegExp(`${key}(\\S+)`);
  const match = lines[0]?.match(regex);
  return match?.[1] ?? "";
}
describe("useWizardViewModel step2 quick years", () => {
  it("starts with empty quickYears", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("trace");
    expect(step2Trace(LINES, "qY=")).toBe("");
  });
  it("tracks quickYears through setQuickYears", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("qy5");
    await press("trace");
    expect(step2Trace(LINES, "qY=")).toBe("5");
  });
});
describe("useWizardViewModel step2 advanced periods", () => {
  it("starts with one missed period", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("trace");
    expect(step2Trace(LINES, "pLen=")).toBe("1");
    expect(step2Trace(LINES, "p0T=")).toBe("missed");
  });
  it("adds a second missed period via addPeriod", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("addP");
    await press("trace");
    expect(step2Trace(LINES, "pLen=")).toBe("2");
    expect(step2Trace(LINES, "p1T=")).toBe("missed");
  });
  it("removes the first period via removePeriod", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("addP");
    await press("addP");
    await press("rmP0");
    await press("trace");
    expect(step2Trace(LINES, "pLen=")).toBe("2");
    expect(step2Trace(LINES, "p0T=")).toBe("missed");
    expect(step2Trace(LINES, "p1T=")).toBe("missed");
  });
  it("switches a period type to regular via updatePeriod", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("upP0");
    await press("trace");
    expect(step2Trace(LINES, "p0T=")).toBe("regular");
  });
  it("updates a period years value via updatePeriod", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("setP0Y");
    await press("trace");
    expect(step2Trace(LINES, "p0Y=")).toBe("3.5");
  });
  it("toggles advanced off and carries missed years into quickYears", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("tog");
    await press("addP");
    await press("setP0Y");
    await press("setP1Y");
    await press("upP1");
    await press("tog");
    await press("trace");
    expect(step2Trace(LINES, "adv=")).toBe("false");
    expect(step2Trace(LINES, "qY=")).toBe("3.5");
  });
  it("toggles advanced on and carries quickYears into the first period", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("qy5");
    await press("tog");
    await press("trace");
    expect(step2Trace(LINES, "adv=")).toBe("true");
    expect(step2Trace(LINES, "pLen=")).toBe("1");
    expect(step2Trace(LINES, "p0T=")).toBe("missed");
    expect(step2Trace(LINES, "p0Y=")).toBe("5");
  });
});
describe("useWizardViewModel step2 validation", () => {
  it("is invalid when quickYears is empty", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("trace");
    expect(step2Trace(LINES, "step2V=")).toBe("false");
    expect(step2Trace(LINES, "er2=")).toContain("quickYears.required");
  });
  it("is invalid when quickYears exceeds prayerActiveYears", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("qy50");
    await press("trace");
    expect(step2Trace(LINES, "step2V=")).toBe("false");
    expect(step2Trace(LINES, "er2=")).toContain("missedYears.exceedsLimit");
  });
  it("is valid with quickYears within range", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("qy5");
    await press("trace");
    expect(step2Trace(LINES, "step2V=")).toBe("true");
    expect(step2Trace(LINES, "er2=")).toBe("");
  });
  it("is invalid when missed years exceed prayerActiveYears in advanced mode", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("tog");
    await press("setP0Y15");
    await press("trace");
    expect(step2Trace(LINES, "step2V=")).toBe("false");
    expect(step2Trace(LINES, "er2=")).toContain("missedYears.exceedsLimit");
  });
  it("is valid in advanced mode with a regular period", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("tog");
    await press("setP0Y");
    await press("upP0");
    await press("trace");
    expect(step2Trace(LINES, "step2V=")).toBe("false");
    expect(step2Trace(LINES, "er2=")).toContain("quickYears.required");
  });
  it("is valid in advanced mode with missed + regular within range", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("tog");
    await press("setP0Y");
    await press("addP");
    await press("setP1Y");
    await press("upP1");
    await press("trace");
    expect(step2Trace(LINES, "step2V=")).toBe("true");
  });
  it("canAddPeriod is true when totalYears is below prayerActiveYears", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("trace");
    expect(step2Trace(LINES, "canAdd=")).toBe("true");
  });
  it("canAddPeriod is false when totalYears equals prayerActiveYears", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("qy14");
    await press("trace");
    expect(step2Trace(LINES, "canAdd=")).toBe("false");
  });
  it("totalMissedDays is 365 for one missed year", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("qy1");
    await press("trace");
    expect(step2Trace(LINES, "missed=")).toBe("365");
  });
  it("totalMissedDays is 730 for two missed years", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("qy2");
    await press("trace");
    expect(step2Trace(LINES, "missed=")).toBe("730");
  });
  it("totalMissedDays ignores zero-valued years", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("qy0");
    await press("trace");
    expect(step2Trace(LINES, "missed=")).toBe("0");
  });
  it("totalMissedDays counts only missed periods in advanced mode", async () => {
    await renderWithProviders(<Harness />);
    await setupWizard();
    LINES.length = 0;
    await press("tog");
    await press("setP0Y");
    await press("addP");
    await press("setP1Y");
    await press("upP1");
    await press("trace");
    expect(step2Trace(LINES, "missed=")).toBe("1278");
  });
});
