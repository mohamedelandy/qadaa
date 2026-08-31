/** @format */
/**
 * Unit tests for StatCard rendering emoji value and label.
 */
import { render, screen } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { StatCard } from "./StatCard";
describe("StatCard", () => {
  it("renders value and label", async () => {
    await render(<StatCard emoji="🔥" value={5} label="Streak" valueColor="gold" />);
    expect(screen.getByText("5")).toBeOnTheScreen();
    expect(screen.getByText("Streak")).toBeOnTheScreen();
  });
});
