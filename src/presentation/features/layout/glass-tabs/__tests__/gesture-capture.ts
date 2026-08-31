/** @format */
/**
 * Test helper arrays capturing mocked Gesture.Pan/Tap handler callbacks for assertions.
 */
export const panHandlers: Array<{ name: string; cb: (...args: unknown[]) => void }> = [];
export const tapHandlers: Array<{ name: string; cb: (...args: unknown[]) => void }> = [];
