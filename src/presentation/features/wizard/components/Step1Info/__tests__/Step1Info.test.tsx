/** @format */
/**
 * Component tests for wizard step 1 inputs syncing to the store.
 */
import { fireEvent, screen } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
jest.mock("react-hook-form", () => {
  return {
    Controller: ({ render }: { render: (props: unknown) => unknown }) =>
      render({
        field: { onChange: jest.fn(), value: "" },
        fieldState: {},
      }),
    useForm: () => ({ control: {}, handleSubmit: () => () => {} }),
  };
});
import { Step1Info } from "../Step1Info";
import { renderWizard, resetWizard } from "../../../__tests__/testUtils";
import { useWizardStore } from "@stores/useWizardStore";
beforeEach(() => {
  resetWizard();
});
describe("Step1Info", () => {
  it("renders the step 1 title", async () => {
    await renderWizard(<Step1Info />);
    expect(screen.getByText("wizard.step1Title")).toBeOnTheScreen();
  });
  it("renders age and puberty age labels", async () => {
    await renderWizard(<Step1Info />);
    expect(screen.getByText("wizard.ageLabel")).toBeOnTheScreen();
    expect(screen.getByText("wizard.pubertyAgeLabel")).toBeOnTheScreen();
  });
  it("updates store age when age input changes", async () => {
    await renderWizard(<Step1Info />);
    const input = screen.getByPlaceholderText("30");
    fireEvent.changeText(input, "25");
    expect(useWizardStore.getState().age).toBe("25");
  });
  it("updates store pubertyAge when puberty age input changes", async () => {
    await renderWizard(<Step1Info />);
    const input = screen.getByPlaceholderText("14");
    fireEvent.changeText(input, "12");
    expect(useWizardStore.getState().pubertyAge).toBe("12");
  });
  it("shows the step-1 error when pubertyAge >= age", async () => {
    useWizardStore.getState().setAge("14");
    useWizardStore.getState().setPubertyAge("14");
    await renderWizard(<Step1Info />);
    expect(screen.getByTestId("wizard-step1-error")).toBeOnTheScreen();
  });
  it("hides the step-1 error when pubertyAge < age", async () => {
    useWizardStore.getState().setAge("14");
    useWizardStore.getState().setPubertyAge("12");
    await renderWizard(<Step1Info />);
    expect(screen.queryByTestId("wizard-step1-error")).not.toBeOnTheScreen();
  });
});
