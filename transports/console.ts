// deno-lint-ignore-file
import { Colors } from "@cross/utils";
import { deepMerge } from "@cross/deepmerge";
import { LogTransportBase, LogTransportBaseOptions } from "./base.ts";
import { Severity } from "../src/types.ts";

interface ConsoleLoggerOptions extends LogTransportBaseOptions {
  minimumSeverity?: Severity;
  severities?: Severity[];
}

export class ConsoleLogger extends LogTransportBase {
  options: ConsoleLoggerOptions;

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
