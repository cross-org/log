import { Colors } from "@cross/utils";
import { deepMerge } from "@cross/deepmerge";
import {
  LogLevel,
  LogTransport,
  LogTransportBaseOptions,
  NumericLogLevel,
} from "../mod.ts";

interface ConsoleLoggerOptions extends LogTransportBaseOptions {
  /**
   *  The minimum log level to be handled by this transport. Defaults to LogLevel.Info
   */
  logLevel?: LogLevel;
}

export class ConsoleLogger implements LogTransport {
  private options: ConsoleLoggerOptions;

  /**
   * Constructs a ConsoleLogger instance.
   * @param options - Optional configuration for the logger.
   */
  constructor(options?: ConsoleLoggerOptions) {
    this.options = deepMerge({
      logLevel: LogLevel.Info,
    }, options || {})!;
  }

  /**
   * Logs a message to the console if the severity meets the transport's log level.
   *
   * @param level - Severity of the message.
   * @param scope - Optional category or group for the message.
   * @param data - Array of data to be logged.
   * @param timestamp - Timestamp for the log entry.
   */
  log(level: LogLevel, scope: string, data: unknown[], timestamp: Date) {
    if (this.shouldLog(level)) {
      const timestampText = Colors.dim(timestamp.toISOString());

      let styledLevel = level.toString().padEnd(5, " ");
      let message = this.formatMessage(data, scope); // Construct message

      switch (level) {
        case LogLevel.Debug:
          styledLevel = Colors.dim(styledLevel);
          message = Colors.dim(message);
          break;
        case LogLevel.Info:
          styledLevel = Colors.blue(styledLevel);
          break;
        case LogLevel.Warn:
          styledLevel = Colors.yellow(styledLevel);
          break;
        case LogLevel.Error:
          styledLevel = Colors.red(styledLevel);
          message = Colors.red(message);
          break;
      }

      const formattedMessage = `${timestampText} ${styledLevel} ${message}`;

      if (level === LogLevel.Error) {
        console.error(formattedMessage);
      } else {
        console.log(formattedMessage);
      }
    }
  }

  /**
   * Helper to format the log message.
   * @param data - Array of data to be logged.
   * @param scope - Optional scope or category of the message.
   * @returns The formatted log message string.
   */
  private formatMessage(data: unknown[], scope: string): string {
    return `${scope}: ${data.join(" ")}`;
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
