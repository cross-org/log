import {
  LogTransport,
  LogTransportBase,
  LogTransportBaseOptions,
} from "./base.ts";
import { Severity } from "../src/types.ts";
import { deepMerge } from "@cross/deepmerge";

interface SplunkHecClientOptions extends LogTransportBaseOptions {
  minimumSeverity?: Severity;
  severities?: Severity[];
  hecEndpoint?: string;
  hecToken?: string;
  sourceType?: string;
}

export class SplunkHecLogger extends LogTransportBase implements LogTransport {
  options: SplunkHecClientOptions;
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
  log(level: Severity, scope: string, data: unknown[], timestamp: Date) {
    if (this.shouldLog(level)) {
      const serializedData = this.serializeToText(data);
      const event = this.formatEvent(level, scope, serializedData, timestamp);
      this.sendToHec(event);
    }
  }

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
