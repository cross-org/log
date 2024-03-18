import { appendFile } from "node:fs/promises";
import {
  LogTransport,
  LogTransportBase,
  LogTransportBaseOptions,
} from "../src/transport.ts";
import { Severity } from "../src/types.ts";

import { deepMerge } from "@cross/deepmerge";

interface FileLoggerOptions extends LogTransportBaseOptions {
  minimumSeverity?: Severity;
  severities?: Severity[];

  /**
   * The path to the file where logs will be written. Defaults to "./app.log".
   */
  filePath?: string;
  /**
   * The output format of log entries. Can be "json" or "txt". Defaults to "txt".
   */
  fileFormat?: "json" | "txt";
}

export class FileLogger extends LogTransportBase implements LogTransport {
  options: FileLoggerOptions;

  /**
   * Constructs a FileLogger instance.
   *
   * @param options - Optional configuration for the file logger.
   */
  constructor(options?: FileLoggerOptions) {
    super();
    this.options = deepMerge(
      this.defaults as FileLoggerOptions,
      {
        minimumSeverity: Severity.Debug,
        filePath: "./app.log",
        fileFormat: "txt",
      },
      options,
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
  log(level: Severity, scope: string, data: unknown[], timestamp: Date) {
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
    level: Severity,
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
}
