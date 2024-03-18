import { Severity, NumericSeverity } from "./types.ts";

export interface LogTransportBaseOptions {
  /**
   * Minimum severity to be logged, can be overridden with severities
   */
  minimumSeverity?: Severity;

  /**
   * Takes precedence over minimumSeverity
   */
  severities?: Severity[];
};

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
    severity: Severity,
    scope: string,
    data: unknown[],
    timestamp: Date,
  ): void;
}

/**
 * Base class for Log Transports.
 */
export abstract class LogTransportBase implements LogTransport {
    protected options: LogTransportBaseOptions;
    protected defaults: LogTransportBaseOptions;
    constructor() {
      this.defaults = {
        minimumSeverity: Severity.Info,
      };
      this.options = this.defaults;
    }
  
    /**
     * Abstract method for logging events. To be implemented by specific transports
     */
    abstract log(
      severity: Severity,
      scope: string,
      data: unknown[],
      timestamp: Date,
    ): void;
  
    /**
     * Determines if the message should be logged based on its severity and the configured log level.
     * @param level - The severity level of the message.
     * @returns True if the message should be logged, false otherwise.
     */
    protected shouldLog(severity: Severity): boolean {
      // Check severities list first (if present)
      if (this.options.severities) {
        return this.options.severities.includes(severity);
      } else {
        // Fallback to minimum severity check
        const minimumLevel = this.options.minimumSeverity ?? Severity.Debug;
        return NumericSeverity.get(severity)! >=
          NumericSeverity.get(minimumLevel)!;
      }
    }
  }
  