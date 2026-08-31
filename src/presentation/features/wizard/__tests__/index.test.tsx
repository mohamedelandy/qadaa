/** @format */
/**
 * Component tests for the Wizard container across steps and platforms.
 */
import { screen } from "@testing-library/react-native";
import { Platform } from "react-native";
import { renderWithProviders } from "@/src/__tests__/testUtils";

jest.mock("react-native-worklets", () => ({
  __esModule: true,
  scheduleOnRN: (cb: () => void) => cb(),
}));

jest.mock("react-native-gesture-handler", () => {
  const buildPan = () => ({
    activeOffsetY: () => buildPan(),
    onUpdate: () => buildPan(),
    onEnd: () => buildPan(),
  });
  return {
    __esModule: true,
    Gesture: { Pan: () => buildPan() },
    GestureDetector: ({ children }: { children: React.ReactNode }) => children,
    GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));

jest.mock("react-hook-form", () => ({
  Controller: ({ render }: { render: (props: unknown) => unknown }) =>
    render({ field: { onChange: jest.fn(), value: "" }, fieldState: {} }),
  useFormContext: jest.fn(),
}));

const mockVM = {
  currentStep: 0,
  control: {},
  setAge: jest.fn(),
  setPubertyAge: jest.fn(),
  step2Control: {},
  advanced: false,
  periods: [],
  toggleAdvanced: jest.fn(),
  setQuickYears: jest.fn(),
  addPeriod: jest.fn(),
  removePeriod: jest.fn(),
  updatePeriod: jest.fn(),
  totalMissedDays: 0,
  step2Error: "",
  totalYears: 0,
  prayerActiveYears: 0,
  canAddPeriod: true,
  dailyTarget: 5,
  customTarget: "",
  step3Error: "",
  setPreset: jest.fn(),
  setCustom: jest.fn(),
  setCustomTarget: jest.fn(),
  age: "",
  pubertyAge: "",
  totalPrayers: 0,
  prevStep: jest.fn(),
  confirm: jest.fn(),
  showNext: true,
  showBack: false,
  t: (k: string) => k,
  isNextDisabled: false,
  nextStep: jest.fn(),
};

jest.mock("../hooks/useWizardViewModel", () => ({
  useWizardViewModel: () => mockVM,
}));

import Wizard from "../index";

describe("Wizard component steps and branches", () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    Platform.OS = originalOS;
    mockVM.currentStep = 0;
    mockVM.showNext = true;
    mockVM.showBack = false;
    mockVM.advanced = false;
    mockVM.periods = [];
    mockVM.dailyTarget = 5;
    mockVM.customTarget = "";
    mockVM.step2Error = "";
    mockVM.step3Error = "";
  });

  it("renders step 1 layout on iOS", async () => {
    Object.defineProperty(Platform, "OS", { value: "ios", configurable: true });
    mockVM.currentStep = 0;
    await renderWithProviders(<Wizard />);
    expect(screen.getByText("wizard.step1Title")).toBeOnTheScreen();
  });

  it("renders step 1 layout on Android", async () => {
    Object.defineProperty(Platform, "OS", { value: "android", configurable: true });
    mockVM.currentStep = 0;
    await renderWithProviders(<Wizard />);
    expect(screen.getByText("wizard.step1Title")).toBeOnTheScreen();
  });

  it("renders step 2 (Periods) layout and nav buttons correctly when back button is shown", async () => {
    mockVM.currentStep = 1;
    mockVM.showBack = true;
    mockVM.showNext = true;
    await renderWithProviders(<Wizard />);
    expect(screen.getByText("wizard.step2Title")).toBeOnTheScreen();
    expect(screen.getByText("wizard.back")).toBeOnTheScreen();
    expect(screen.getByText("wizard.next")).toBeOnTheScreen();
  });

  it("renders step 3 (Pace) layout when only next button is shown", async () => {
    mockVM.currentStep = 2;
    mockVM.showBack = false;
    mockVM.showNext = true;
    await renderWithProviders(<Wizard />);
    expect(screen.getByText("wizard.step3Title")).toBeOnTheScreen();
  });

  it("renders step 4 (Summary) layout when next button is hidden", async () => {
    mockVM.currentStep = 3;
    mockVM.showBack = true;
    mockVM.showNext = false;
    await renderWithProviders(<Wizard />);
    expect(screen.getByText("wizard.step4Title")).toBeOnTheScreen();
  });

  it("renders nothing inside nav bar if both showNext and showBack are false", async () => {
    mockVM.showBack = false;
    mockVM.showNext = false;
    await renderWithProviders(<Wizard />);
    expect(screen.queryByText("wizard.back")).not.toBeOnTheScreen();
    expect(screen.queryByText("wizard.next")).not.toBeOnTheScreen();
  });
});
