/** @format */
/**
 * Unit tests for StepIndicator.
 */
import { screen } from "@testing-library/react-native";
import { StepIndicator } from "@components/StepIndicator/StepIndicator";
import { renderWithProviders } from "@/src/__tests__/testUtils";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));

describe("StepIndicator", () => {
  async function renderStep(currentStep: number, totalSteps: number) {
    return renderWithProviders(<StepIndicator currentStep={currentStep} totalSteps={totalSteps} />);
  }
  function dotsOf() {
    const root = screen.root;
    if (!root) throw new Error("no root");
    return root.queryAll((n) => Array.isArray(n.props["style"]));
  }
  function dotAt(index: number) {
    const dots = dotsOf();
    const dot = dots[index];
    if (!dot) throw new Error(`no dot at index ${index}`);
    return dot;
  }
  it("renders one dot per total step", async () => {
    await renderStep(0, 4);
    expect(dotsOf()).toHaveLength(4);
  });
  it("highlights the active step and advances it", async () => {
    await renderStep(1, 3);
    expect(dotAt(1).props["style"]).toEqual(
      expect.arrayContaining([expect.objectContaining({ width: 24 })])
    );
    await renderStep(2, 3);
    expect(dotAt(2).props["style"]).toEqual(
      expect.arrayContaining([expect.objectContaining({ width: 24 })])
    );
  });
});
