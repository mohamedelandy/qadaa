/** @format */
/**
 * Unit tests for Skeleton.
 */
import { screen } from "@testing-library/react-native";
import { Skeleton } from "../Skeleton";
import { renderWithProviders } from "@/src/__tests__/testUtils";

describe("Skeleton", () => {
  it("renders with default dimensions", async () => {
    await renderWithProviders(<Skeleton testID="skeleton-bar" />);
    expect(screen.getByTestId("skeleton-bar")).toBeOnTheScreen();
  });
  it("renders with custom width and height", async () => {
    await renderWithProviders(<Skeleton width={200} height={16} testID="skeleton-bar" />);
    expect(screen.getByTestId("skeleton-bar")).toBeOnTheScreen();
  });
  it("renders with custom borderRadius", async () => {
    await renderWithProviders(
      <Skeleton width={100} height={100} borderRadius={50} testID="skeleton-bar" />
    );
    expect(screen.getByTestId("skeleton-bar")).toBeOnTheScreen();
  });
  it("renders with custom color override", async () => {
    await renderWithProviders(<Skeleton color="#ff0000" testID="skeleton-bar" />);
    expect(screen.getByTestId("skeleton-bar")).toBeOnTheScreen();
  });
  it("renders the lottie shimmer instead of a bar when useLottie is enabled", async () => {
    await renderWithProviders(
      <Skeleton useLottie width={200} height={24} testID="skeleton-shimmer" />
    );
    expect(screen.getByTestId("lottie-shimmer")).toBeOnTheScreen();
    expect(screen.queryByTestId("skeleton-shimmer")).not.toBeOnTheScreen();
  });
  it("defaults the testID to skeleton-bar when none is provided", async () => {
    await renderWithProviders(<Skeleton />);
    expect(screen.getByTestId("skeleton-bar")).toBeOnTheScreen();
  });
});
