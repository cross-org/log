import { ConsoleLogger } from "../transports/console.ts";
import { LogTransport } from "../transports/base.ts";
import { Severity } from "./types.ts";

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
    this.forward(Severity.Debug, "default", data);
  }

  /**
   * Logs a message with Info severity.
   * @param data - Data to be logged.
   */
  info(...data: unknown[]) {
    this.forward(Severity.Info, "default", data);
  }

  /**
   * Logs a message with Log severity.
   * @param data - Data to be logged.
   */
  log(...data: unknown[]) {
    this.forward(Severity.Log, "default", data);
  }

  /**
   * Logs a message with Warn severity.
   * @param data - Data to be logged.
   */
  warn(...data: unknown[]) {
    this.forward(Severity.Warn, "default", data);
  }

  /**
   * Logs a message with Error severity.
   * @param data - Data to be logged.
   */
  error(...data: unknown[]) {
    this.forward(Severity.Error, "default", data);
  }

  /**
   * Forwards the log message to all registered transports.
   * @param severity - The severity of the message.
   * @param scope - The scope of the message.
   * @param data - Data to be logged.
   */
  private forward(severity: Severity, scope: string, data: unknown[]) {
    const timestamp = new Date();
    this.transports.forEach((transport) => {
      transport.log(severity, scope, data, timestamp);
    });
  }
}
