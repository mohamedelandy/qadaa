/** @format */
/**
 * Component tests for Step2Periods: meter, add/remove limits, and type toggles updating wizard store.
 */
import { screen, userEvent } from "@testing-library/react-native";

jest.useFakeTimers();
const user = userEvent.setup();
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, vars?: Record<string, string | number>) => {
      if (key === "wizard.yearsUsedMeter")
        return `${vars?.["used"]} / ${vars?.["total"]} years used`;
      if (key === "wizard.addPeriod") return "addPeriod";
      if (key === "wizard.removePeriod") return "removePeriod";
      if (key === "wizard.periodMissed") return "missed";
      if (key === "wizard.periodRegular") return "regular";
      return key;
    },
    i18n: { language: "en" },
  }),
}));
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
}));
jest.mock("react-hook-form", () => ({
  Controller: ({ render }: { render: (props: unknown) => unknown }) =>
    render({
      field: { onChange: jest.fn(), value: "" },
      fieldState: {},
    }),
}));
import * as Haptics from "expo-haptics";
import { Step2Periods } from "../Step2Periods";
import { renderWizard, seedWizard, resetWizard } from "../../../__tests__/testUtils";
import { useWizardStore, type WizardPeriod } from "@stores/useWizardStore";
beforeEach(() => {
  resetWizard();
});
function seedAdvanced(periods: WizardPeriod[], age = "18", pubertyAge = "14") {
  seedWizard({ advanced: true, periods, age, pubertyAge });
}
async function press(id: string) {
  await user.press(screen.getByTestId(id));
}
async function changeText(id: string, text: string) {
  const input = screen.getByTestId(id);
  await user.clear(input);
  await user.type(input, text);
}
describe("Step2Periods advanced mode", () => {
  it("shows the years-used meter", async () => {
    seedAdvanced([{ type: "missed", years: "2" }]);
    await renderWizard(<Step2Periods />);
    expect(screen.getByText("2 / 4 years used")).toBeOnTheScreen();
  });
  it("disables Add period when totalYears reaches prayerActiveYears", async () => {
    seedAdvanced([{ type: "missed", years: "4" }]);
    await renderWizard(<Step2Periods />);
    const addBtn = screen.getByTestId("wizard-add-period-btn");
    expect(addBtn.props["accessibilityState"]?.["disabled"] ?? addBtn.props["disabled"]).toBe(true);
  });
  it("updates period type to missed when missed button is pressed", async () => {
    seedAdvanced([{ type: "regular", years: "2" }]);
    await renderWizard(<Step2Periods />);
    await press("wizard-period-0-type-missed");
    expect(useWizardStore.getState().periods[0]?.type).toBe("missed");
  });
  it("updates period type to regular when regular button is pressed", async () => {
    seedAdvanced([{ type: "missed", years: "2" }]);
    await renderWizard(<Step2Periods />);
    await press("wizard-period-0-type-regular");
    expect(useWizardStore.getState().periods[0]?.type).toBe("regular");
  });
  it("updates the second period row type", async () => {
    seedAdvanced([
      { type: "regular", years: "2" },
      { type: "regular", years: "1" },
    ]);
    await renderWizard(<Step2Periods />);
    await press("wizard-period-1-type-missed");
    expect(useWizardStore.getState().periods[1]?.type).toBe("missed");
  });
  it("calls haptics when type button is pressed", async () => {
    seedAdvanced([{ type: "regular", years: "2" }]);
    await renderWizard(<Step2Periods />);
    await press("wizard-period-0-type-missed");
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });
  it("removes a period when remove is pressed", async () => {
    seedAdvanced([
      { type: "missed", years: "2" },
      { type: "regular", years: "1" },
    ]);
    await renderWizard(<Step2Periods />);
    await press("wizard-period-1-remove-btn");
    expect(useWizardStore.getState().periods).toHaveLength(1);
  });
  it("updates period years with cleaned decimal", async () => {
    seedAdvanced([{ type: "missed", years: "" }]);
    await renderWizard(<Step2Periods />);
    await changeText("wizard-period-0-years-input", "3.5");
    expect(useWizardStore.getState().periods[0]?.years).toBe("3.5");
  });
  it("updates the second period years input", async () => {
    seedAdvanced([
      { type: "missed", years: "2" },
      { type: "regular", years: "" },
    ]);
    await renderWizard(<Step2Periods />);
    await changeText("wizard-period-1-years-input", "1.5");
    expect(useWizardStore.getState().periods[1]?.years).toBe("1.5");
  });
  it("cleans non-numeric input on the first row", async () => {
    seedAdvanced([{ type: "missed", years: "2" }]);
    await renderWizard(<Step2Periods />);
    await changeText("wizard-period-0-years-input", "abc3");
    expect(useWizardStore.getState().periods[0]?.years).toBe("3");
  });
  it("adds a period when add button is pressed", async () => {
    seedAdvanced([{ type: "missed", years: "2" }]);
    await renderWizard(<Step2Periods />);
    await press("wizard-add-period-btn");
    expect(useWizardStore.getState().periods).toHaveLength(2);
  });
  it("calls haptics when add period button is pressed", async () => {
    seedAdvanced([{ type: "missed", years: "2" }]);
    await renderWizard(<Step2Periods />);
    await press("wizard-add-period-btn");
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });
});
describe("Step2Periods quick mode", () => {
  it("renders quick years input when not advanced", async () => {
    await renderWizard(<Step2Periods />);
    expect(screen.getByText("wizard.yearsLabel")).toBeOnTheScreen();
  });
  it("updates store quickYears when quick years input changes", async () => {
    await renderWizard(<Step2Periods />);
    await changeText("wizard-years-quick-input", "3");
    expect(useWizardStore.getState().quickYears).toBe("3");
  });
});
describe("Step2Periods error display", () => {
  it("shows step2Error when advanced is true and total years exceed active years", async () => {
    seedAdvanced([
      { type: "missed", years: "4" },
      { type: "regular", years: "2" },
    ]);
    await renderWizard(<Step2Periods />);
    expect(screen.getByText("validation.totalYears.exceedsLimit")).toBeOnTheScreen();
  });
  it("does not show error when advanced periods are valid", async () => {
    seedAdvanced([{ type: "missed", years: "2" }]);
    await renderWizard(<Step2Periods />);
    expect(screen.queryByText("validation.totalYears.exceedsLimit")).not.toBeOnTheScreen();
  });
});
