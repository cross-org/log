// deno-lint-ignore-file
import { Colors } from "@cross/utils";
import { deepMerge } from "@cross/deepmerge";
import { LogTransportBase, LogTransportBaseOptions } from "./base.ts";
import { Severity } from "../src/types.ts";

/**
 * Configuration options for the ConsoleLogger transport. Extends the
 * base logging options for all log transports.
 */
export interface ConsoleLoggerOptions extends LogTransportBaseOptions {
  /**
   * The minimum severity level for a message to be logged to the console.
   * If a message's severity is lower than this value, it will not be displayed.
   * This option is overridden if the `severities` option is provided.
   */
  minimumSeverity?: Severity;

  /**
   * An array of specific severity levels to log to the console. Messages
   * with severity levels not included in this array will be ignored. This
   * option takes precedence over `minimumSeverity`.
   */
  severities?: Severity[];
}

/**
 * A Log Transport implementation that sends log events to the browser's console
 * or Node.js console output, providing basic styling and severity-based formatting.
 */
export class ConsoleLogger extends LogTransportBase {
  /**
   * Options for the ConsoleLogger transport
   */
  public options: ConsoleLoggerOptions;

  /**
   * Constructs a ConsoleLogger instance.
   * @param options - Optional configuration for the logger.
   */
  constructor(options?: ConsoleLoggerOptions) {
    super();
    this.options = deepMerge(
      this.defaults as ConsoleLoggerOptions,
      {
        /* FileLogger specific defaults */
      },
      options,
    )!;
  }

  /**
   * Logs a message to the console if the severity meets the transport's log level.
   *
   * @param level - Severity of the message.
   * @param scope - Optional category or group for the message.
   * @param data - Array of data to be logged.
   * @param timestamp - Timestamp for the log entry.
   */
  log(level: Severity, scope: string, data: unknown[], timestamp: Date) {
    if (this.shouldLog(level)) {
      const timestampText = Colors.dim(timestamp.toISOString());

      let styledLevel = level.toString().padEnd(5, " ");

      // Serialize objects in the data array
      const serializedData = this.serializeToText(data);

      let message = `${scope}: ${serializedData.join(" ")}`;

      switch (level) {
        case Severity.Debug:
          styledLevel = Colors.dim(styledLevel);
          message = Colors.dim(message);
          break;
        case Severity.Info:
          styledLevel = Colors.blue(styledLevel);
          break;
        case Severity.Warn:
          styledLevel = Colors.yellow(styledLevel);
          break;
        case Severity.Error:
          styledLevel = Colors.red(styledLevel);
          message = Colors.red(message);
          break;
      }

      const formattedMessage = `${timestampText} ${styledLevel} ${message}`;

      if (level === Severity.Error) {
        console.error(formattedMessage);
      } else {
        console.log(formattedMessage);
      }
    }
  }
}
