import {
  LogTransport,
  LogTransportBase,
  LogTransportBaseOptions,
} from "./base.ts";
import { Severity } from "../src/types.ts";
import { deepMerge } from "@cross/deepmerge";

/**
 * Configuration options for the New Relic logger. Extends the base logging options.
 */
export interface NewRelicLoggerOptions extends LogTransportBaseOptions {
  /**
   * Your New Relic Insights Insert API key. This is required for sending logs.
   */
  apiKey: string;

  /**
   * The New Relic region where your data is stored.
   * Valid values: 'US', 'EU', 'FedRamp'. Defaults to 'US'.
   */
  region?: string;

  /**
   * An attribute name to identify the service generating the logs.
   * Will be added to log events in New Relic.
   */
  serviceAttribute?: string;

  /**
   * An attribute name to categorize the log type. Will be added to
   * log events in New Relic.
   */
  logtypeAttribute?: string;

  /**
   * An attribute name to specify the hostname of the machine generating the logs.
   * Will be added to log events in New Relic.
   */
  hostnameAttribute?: string;
}

/**
 * A Log Transport implementation that sends log events to New Relic Insights.
 */
export class NewRelicLogger extends LogTransportBase implements LogTransport {
  /**
   * Options for the NewRelicLogger Transport
   */
  public options: NewRelicLoggerOptions;

  /**
   * Creates a new NewRelicLogger instance.
   *
   * @param options - Configuration options for the New Relic logger.
   */
  constructor(options: NewRelicLoggerOptions) {
    super();
    this.options = deepMerge(
      this.defaults as NewRelicLoggerOptions,
      options,
    )!;
  }

  /**
   * Logs a message to New Relic Insights. Used as an entrypoint for each log into this transport.
   *
   * @param severity - The severity level of the message.
   * @param scope - An optional scope to categorize or group the log message.
   * @param data - An array of data to be logged.
   * @param timestamp - The timestamp of the log entry.
   */
  log(severity: Severity, scope: string, data: unknown[], timestamp: Date) {
    if (this.shouldLog(severity)) {
      const serializedData = this.serializeToText(data);
      const event = this.formatEvent(
        severity,
        scope,
        serializedData,
        timestamp,
      );
      this.sendToNewRelic(event);
    }
  }

  /**
   * Formats a log event in a structure suitable for New Relic Insights.
   *
   * @param severity - The severity level of the message.
   * @param scope - The scope of the log message.
   * @param data - The serialized log data.
   * @param timestamp -  The timestamp of the log entry.
   * @returns A formatted event object ready to be sent to New Relic.
   */
  private formatEvent(
    severity: Severity,
    scope: string,
    data: unknown[],
    timestamp: Date,
  ): object {
    return {
      logtype: this.options.logtypeAttribute,
      service: this.options.serviceAttribute,
      hostname: this.options.hostnameAttribute,
      timestamp: timestamp.getTime(),
      message: data.join(" "),
      severity,
      scope,
    };
  }

  /**
   * Sends a log event to New Relic Insights. Handles potential errors.
   *
   * @param event - The formatted log event object.
   */
  private async sendToNewRelic(event: object) {
    const endpoint = this.getEndpoint();
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(event),
        headers: {
          "Content-Type": "application/json",
          "Api-Key": this.options.apiKey,
        },
      });
      if (!response.ok) {
        console.error(
          "Error sending log event to New Relic: ",
          response.status,
          response.statusText,
        );
      }
    } catch (error) {
      console.error("Network error sending log event to New Relic:", error);
    }
  }
  /**
   * Determines the correct New Relic Insights API endpoint based on the configured region.
   * @returns The API endpoint URL as a string.
   */
  private getEndpoint(): string {
    if (this.options.region === "US") {
      return "https://log-api.newrelic.com/log/v1";
    } else if (this.options.region === "EU") {
      return "https://log-api.eu.newrelic.com/log/v1";
    } else if (this.options.region === "FedRamp") {
      return "https://gov-log-api.newrelic.com/log/v1";
    } else {
      throw new Error(
        "Unknown New Relic Region. Please check your configuration.",
      );
    }
  }
}
