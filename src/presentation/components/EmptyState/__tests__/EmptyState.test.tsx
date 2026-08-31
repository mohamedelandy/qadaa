/** @format */
/**
 * Unit tests for EmptyState.
 */
import { screen, userEvent } from "@testing-library/react-native";
import { EmptyState } from "../EmptyState";
import { renderWithProviders } from "@/src/__tests__/testUtils";

jest.useFakeTimers();

describe("EmptyState", () => {
  it("renders title and subtitle", async () => {
    await renderWithProviders(
      <EmptyState icon="calendar-outline" title="No items" subtitle="Nothing here yet" />
    );
    expect(screen.getByText("No items")).toBeOnTheScreen();
    expect(screen.getByText("Nothing here yet")).toBeOnTheScreen();
  });
  it("renders without optional props", async () => {
    await renderWithProviders(<EmptyState icon="calendar-outline" title="No items" />);
    expect(screen.getByText("No items")).toBeOnTheScreen();
  });
  it("renders action button when actionLabel is provided", async () => {
    const onPress = jest.fn();
    await renderWithProviders(
      <EmptyState
        icon="add-circle-outline"
        title="Empty"
        actionLabel="Add item"
        onAction={onPress}
      />
    );
    expect(screen.getByText("Add item")).toBeOnTheScreen();
  });
  it("calls onAction when action button is pressed", async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await renderWithProviders(
      <EmptyState
        icon="add-circle-outline"
        title="Empty"
        actionLabel="Add item"
        onAction={onPress}
      />
    );
    await user.press(screen.getByText("Add item"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
  it("renders icon with correct testID", async () => {
    await renderWithProviders(<EmptyState icon="calendar-outline" title="No items" />);
    expect(screen.getByTestId("empty-state-icon")).toBeOnTheScreen();
  });
  it("renders LottieView when animationName is provided", async () => {
    await renderWithProviders(
      <EmptyState icon="sparkles" title="All caught up" animationName="sparkles" />
    );
    expect(screen.queryByTestId("empty-state-icon")).not.toBeOnTheScreen();
    expect(screen.getByTestId("lottie-sparkles")).toBeOnTheScreen();
  });
});
