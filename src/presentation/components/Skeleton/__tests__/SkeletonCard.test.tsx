/** @format */
/**
 * Unit tests for SkeletonCard.
 */
import { screen } from "@testing-library/react-native";
import { SkeletonCard } from "../SkeletonCard";
import { renderWithProviders } from "@/src/__tests__/testUtils";

describe("SkeletonCard", () => {
  it("renders a card with default skeleton bars", async () => {
    await renderWithProviders(<SkeletonCard testID="skeleton-card" />);
    expect(screen.getByTestId("skeleton-card")).toBeOnTheScreen();
  });
  it("renders with custom number of lines", async () => {
    await renderWithProviders(<SkeletonCard lines={5} testID="skeleton-card" />);
    expect(screen.getByTestId("skeleton-card")).toBeOnTheScreen();
  });
  it("renders without header when showHeader is false", async () => {
    await renderWithProviders(<SkeletonCard showHeader={false} testID="skeleton-card" />);
    expect(screen.getByTestId("skeleton-card")).toBeOnTheScreen();
  });
  it("renders with custom style", async () => {
    await renderWithProviders(<SkeletonCard style={{ opacity: 0.5 }} testID="skeleton-card" />);
    expect(screen.getByTestId("skeleton-card")).toBeOnTheScreen();
  });
});
