import {
  LogTransport,
  LogTransportBase,
  LogTransportBaseOptions,
} from "./base.ts";
import { Severity } from "../src/types.ts";
import { deepMerge } from "@cross/deepmerge";

interface NewRelicLoggerOptions extends LogTransportBaseOptions {
  apiKey: string; // The user's New Relic API key
  region?: string; // The New Relic region (e.g., 'US', 'EU')
  serviceAttribute?: string;
  logtypeAttribute?: string;
  hostnameAttribute?: string;
}

export class NewRelicLogger extends LogTransportBase implements LogTransport {
  options: NewRelicLoggerOptions;

  constructor(options: NewRelicLoggerOptions) {
    super();
    this.options = deepMerge(
      this.defaults as NewRelicLoggerOptions,
      options,
    )!;
  }

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
