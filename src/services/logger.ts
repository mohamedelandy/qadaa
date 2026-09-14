export const Logger = {
  debug: (message: string, context?: Record<string, unknown>) => {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.debug(JSON.stringify({ level: "debug", message, ...context }));
    }
  },
  info: (message: string, context?: Record<string, unknown>) => {
    // eslint-disable-next-line no-console
    console.info(JSON.stringify({ level: "info", message, ...context }));
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn(JSON.stringify({ level: "warn", message, ...context }));
  },
  error: (message: string, error?: unknown, context?: Record<string, unknown>) => {
    const errorDetails =
      error instanceof Error
        ? { errorName: error.name, errorMessage: error.message, stack: error.stack }
        : { error };
    console.error(JSON.stringify({ level: "error", message, ...errorDetails, ...context }));
  },
};
