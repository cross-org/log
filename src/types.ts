/**
 * Map for convenient comparison of log levels by numeric value.
 */
export const NumericSeverity: Map<string, number> = new Map([
  ["DEBUG", 100],
  ["INFO", 200],
  ["LOG", 300],
  ["WARN", 400],
  ["ERROR", 500],
]);

/**
 * Enumeration of available log levels.
 */
export enum Severity {
  Debug = "DEBUG",
  Info = "INFO",
  Log = "LOG",
  Warn = "WARN",
  Error = "ERROR",
}
