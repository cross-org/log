import { appendFile } from "node:fs/promises";
import {
  LogLevel,
  LogTransport,
  LogTransportBaseOptions,
  NumericLogLevel,
} from "../mod.ts";
import { deepMerge } from "@cross/deepmerge";

interface FileLoggerOptions extends LogTransportBaseOptions {
  /**
   * The minimum log level that this transport will handle. Defaults to LogLevel.Info.
   */
  logLevel?: LogLevel;
  /**
   * The path to the file where logs will be written. Defaults to "./app.log".
   */
  filePath?: string;
  /**
   * The output format of log entries. Can be "json" or "txt". Defaults to "txt".
   */
  fileFormat?: "json" | "txt";
}

export class FileLogger implements LogTransport {
  private options: FileLoggerOptions;

  /**
   * Constructs a FileLogger instance.
   *
   * @param options - Optional configuration for the file logger.
   */
  constructor(options?: FileLoggerOptions) {
    this.options = deepMerge(
      {
        logLevel: LogLevel.Info,
        filePath: "./app.log",
        fileFormat: "txt",
      },
      options || {},
    )!;
  }
  /**
   * Logs a message to the configured file if the severity is at or above the transport's log level.
   *
   * @param level - The severity level of the message.
   * @param scope - Optional category or group for the message.
   * @param data - Array of data to be logged.
   * @param timestamp - Timestamp for the log entry.
   */
  log(level: LogLevel, scope: string, data: unknown[], timestamp: Date) {
    if (this.shouldLog(level)) {
      const message = this.formatMessage(level, scope, data, timestamp);
      appendFile(this.options.filePath!, message)
        .catch((err) => console.error(`Error writing to log file:`, err));
    }
  }
  /**
   * Formats the log message according to specified options.
   * @param level - The severity level of the message.
   * @param scope - Optional scope or category for the message.
   * @param data - Array of data to be logged.
   * @param timestamp - Timestamp of the log message.
   * @returns The formatted log message as a string.
   */
  private formatMessage(
    level: LogLevel,
    scope: string,
    data: unknown[],
    timestamp: Date,
  ): string {
    const timestampText = timestamp.toISOString();
    const message = scope ? `${scope}: ${data.join(" ")}` : data.join(" ");

    switch (this.options.fileFormat) {
      case "json":
        return JSON.stringify({ timestamp: timestampText, level, message }) +
          "\n";
      default: // txt
        return `[${timestampText}] [${level}] ${message}\n`;
    }
  }
  /**
   * Determines if the message should be logged based on its severity and the configured log level.
   * @param level - The severity level of the message.
   * @returns True if the message should be logged, false otherwise.
   */
  private shouldLog(level: LogLevel): boolean {
    const currentLogLevel = this.options.logLevel ?? LogLevel.Debug;
    return NumericLogLevel.get(level)! >= NumericLogLevel.get(currentLogLevel)!;
  }
}
