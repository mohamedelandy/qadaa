/** @format */
/**
 * Component tests for wizard step 3 pace presets and custom target input.
 */
import { screen, userEvent } from "@testing-library/react-native";

jest.useFakeTimers();
const user = userEvent.setup();
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));
import { Step3Pace } from "../Step3Pace";
import { renderWizard, seedWizard, resetWizard } from "../../../__tests__/testUtils";
import { useWizardStore } from "@stores/useWizardStore";
beforeEach(() => {
  resetWizard();
});
describe("Step3Pace", () => {
  it("renders the three preset pace buttons", async () => {
    await renderWizard(<Step3Pace />);
    expect(screen.getAllByText("wizard.pace1")).toHaveLength(1);
    expect(screen.getAllByText("wizard.pace5")).toHaveLength(1);
    expect(screen.getAllByText("wizard.pace10")).toHaveLength(1);
  });
  it("renders the custom option button", async () => {
    await renderWizard(<Step3Pace />);
    expect(screen.getByText("wizard.paceCustom")).toBeOnTheScreen();
  });
  it("shows the custom input when custom is selected", async () => {
    seedWizard({ dailyTarget: -1 });
    await renderWizard(<Step3Pace />);
    expect(screen.getByPlaceholderText("7")).toBeOnTheScreen();
  });
  it("shows the custom validation error", async () => {
    seedWizard({ dailyTarget: -1, customTarget: "51" });
    await renderWizard(<Step3Pace />);
    expect(screen.getByText("validation.custom.range")).toBeOnTheScreen();
  });
  it("invokes setPreset with the selected value", async () => {
    await renderWizard(<Step3Pace />);
    await user.press(screen.getByTestId("wizard-pace-10-btn"));
    expect(useWizardStore.getState().dailyTarget).toBe(10);
  });
});
