import {
  LogTransport,
  LogTransportBase,
  LogTransportBaseOptions,
} from "./base.ts";
import { Severity } from "../src/types.ts";
import { deepMerge } from "@cross/deepmerge";

/**
 * Configuration options for the Splunk HEC (HTTP Event Collector) logger.
 * Extends the base LogTransportBaseOptions.
 */
export interface SplunkHecClientOptions extends LogTransportBaseOptions {
  minimumSeverity?: Severity;
  severities?: Severity[];

  /**
   * The HTTP Event Collector endpoint for your Splunk instance.
   */
  hecEndpoint?: string;

  /**
   * The authorization token for sending events to Splunk HEC.
   */
  hecToken?: string;

  /**
   * The source type to be associated with the log events in Splunk.
   */
  sourceType?: string;
}

/**
 *  A Log Transport implementation that sends log events to Splunk's HTTP Event Collector (HEC).
 */
export class SplunkHecLogger extends LogTransportBase implements LogTransport {
  /**
   * Options for the Splunk HEC Transport
   */
  public options: SplunkHecClientOptions;

  /**
   * Creates a new SplunkHecLogger instance.
   *
   * @param options - Configuration options for the Splunk HEC logger.
   */
  constructor(options: SplunkHecClientOptions) {
    super();
    this.options = deepMerge(
      this.defaults as SplunkHecClientOptions,
      {
        /* SplunkHecClientOptions specific defaults */
      },
      options,
    )!;
  }

  /**
   * Logs a message to Splunk HEC. Used as an entrypoint for each log into this transport.
   *
   * @param severity - The severity level of the message.
   * @param scope - An optional scope to categorize or group the log message.
   * @param data - An array of data to be logged.
   * @param timestamp - The timestamp of the log entry.
   */
  log(level: Severity, scope: string, data: unknown[], timestamp: Date) {
    if (this.shouldLog(level)) {
      const serializedData = this.serializeToText(data);
      const event = this.formatEvent(level, scope, serializedData, timestamp);
      this.sendToHec(event);
    }
  }

  /**
   * Transforms this event into a format suitable for Splunk HEC
   */
  private formatEvent(
    level: Severity,
    scope: string,
    data: unknown[],
    timestamp: Date,
  ): object {
    return {
      time: timestamp.getTime() / 1000,
      source: scope,
      sourcetype: this.options.sourceType,
      event: {
        level,
        message: data,
      },
    };
  }

  /**
   * Sends a log event to Splunk's HTTP Event Collector. Handles potential errors.
   *
   * @param event - The formatted log event object.
   */
  private async sendToHec(event: object) {
    if (this.options.hecEndpoint && this.options.hecToken) {
      try {
        const _response = await fetch(this.options.hecEndpoint, {
          method: "POST",
          headers: {
            "Authorization": `Splunk ${this.options.hecToken}`,
          },
          body: JSON.stringify(event),
        });

        // Handle response status codes (potential errors)
      } catch (error) {
        // Robust error logging (potentially to a local file)
        console.error("Error sending log event to Splunk:", error);
      }
    }
  }
}
