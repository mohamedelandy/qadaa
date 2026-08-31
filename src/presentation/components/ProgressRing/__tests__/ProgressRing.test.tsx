/** @format */
/**
 * Unit tests for ProgressRing.
 */
import { act, screen } from "@testing-library/react-native";
import { ProgressRing } from "../ProgressRing";
import { renderWithProviders } from "@/src/__tests__/testUtils";

jest.useFakeTimers();

describe("ProgressRing", () => {
  it("renders with default color", async () => {
    await renderWithProviders(<ProgressRing progress={50} />);
    expect(screen.root).toBeOnTheScreen();
  });
  it("renders with custom color", async () => {
    await renderWithProviders(<ProgressRing progress={50} color="#ff0000" />);
    expect(screen.root).toBeOnTheScreen();
  });
  it("renders complete state", async () => {
    await renderWithProviders(<ProgressRing progress={100} />);
    expect(screen.root).toBeOnTheScreen();
  });
  it("renders the percentage label upright (not rotated)", async () => {
    await renderWithProviders(<ProgressRing progress={75} showLabel />);
    await act(async () => {
      jest.advanceTimersByTime(700);
    });
    expect(screen.getByText("75%")).toBeOnTheScreen();
  });
  it("hides the label when showLabel is false", async () => {
    await renderWithProviders(<ProgressRing progress={100} showLabel={false} />);
    await act(async () => {
      jest.advanceTimersByTime(700);
    });
    expect(screen.queryByText("100%")).not.toBeOnTheScreen();
  });
});
