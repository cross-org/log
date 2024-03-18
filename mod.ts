import { ConsoleLogger } from "./transports/console.ts";

/**
 * Base options for Log Transports.
 */
export interface LogTransportBaseOptions {
  logLevel?: LogLevel;
}

/**
 * Enumeration of available log levels.
 */
export enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Log = "LOG",
  Warn = "WARN",
  Error = "ERROR",
}

/**
 * Interface for defining the core functionality of a Log Transport.
 */
export interface LogTransport {
  /**
   * Logs a message with the specified severity, scope, data, and timestamp.
   *
   * @param severity - The severity level of the message.
   * @param scope - An optional scope to categorize or group the log message.
   * @param data - An array of data to be logged.
   * @param timestamp - The timestamp of the log entry.
   */
  log(
    severity: LogLevel,
    scope: string,
    data: unknown[],
    timestamp: Date,
  ): void;
}

/**
 * Map for convenient comparison of log levels by numeric value.
 */
export const NumericLogLevel: Map<string, number> = new Map([
  ["DEBUG", 100],
  ["INFO", 200],
  ["LOG", 300],
  ["WARN", 400],
  ["ERROR", 500],
]);

/**
 * Main Log class for managing and dispatching log messages to transports.
 */
export class Log {
  /**
   * Array of LogTransport objects responsible for handling log messages.
   */
  transports: LogTransport[] = [];

  constructor(transports?: LogTransport[]) {
    if (!transports) {
      this.transports.push(new ConsoleLogger()); // Default
    } else {
      this.transports = transports;
    }
  }

  /**
   * Logs a message with Debug severity.
   * @param data - Data to be logged.
   */
  debug(...data: unknown[]) {
    this.forward(LogLevel.Debug, "default", data);
  }

  /**
   * Logs a message with Info severity.
   * @param data - Data to be logged.
   */
  info(...data: unknown[]) {
    this.forward(LogLevel.Info, "default", data);
  }

  /**
   * Logs a message with Log severity.
   * @param data - Data to be logged.
   */
  log(...data: unknown[]) {
    this.forward(LogLevel.Log, "default", data);
  }

  /**
   * Logs a message with Warn severity.
   * @param data - Data to be logged.
   */
  warn(...data: unknown[]) {
    this.forward(LogLevel.Warn, "default", data);
  }

  /**
   * Logs a message with Error severity.
   * @param data - Data to be logged.
   */
  error(...data: unknown[]) {
    this.forward(LogLevel.Error, "default", data);
  }

  /**
   * Forwards the log message to all registered transports.
   * @param severity - The severity of the message.
   * @param scope - The scope of the message.
   * @param data - Data to be logged.
   */
  private forward(severity: LogLevel, scope: string, data: unknown[]) {
    const timestamp = new Date();
    this.transports.forEach((transport) => {
      transport.log(severity, scope, data, timestamp);
    });
  }
}

/**
 * Re-export of common transports
 *
 * All transports is available by using
 *
 * ```
 * import { FileLogger } from "@cross/log/file";
 * import { ConsoleLogger } from "@cross/log/console";
 * // ... etc
 * ```
 */
export { ConsoleLogger } from "./transports/console.ts";
export { FileLogger } from "./transports/file.ts";
