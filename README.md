**@cross/log - Flexible cross-runtime logging for Node.js, Deno, and Bun**

Part of the @cross suite - check out our growing collection of cross-runtime
tools at [github.com/cross-org](https://github.com/cross-org).

## Installation

Instructions are available at
[https://jsr.io/@cross/log](https://jsr.io/@cross/log). Here's the quick
version:

```bash
deno add @cross/log     # Deno
npx jsr add @cross/log  # Node.js
bunx jsr add @cross/log # Bun
```

## Getting Started

```javascript
import { Log } from "@cross/log";

const logger = new Log(); // Uses ConsoleLogger with default settings by default

logger.info("Hello log!");
```

**Key Features**

- **Flexible Log Levels:** Use standard severities (Debug, Info, Warn, Error)
  for easy categorization.
- **Customizable Output:** Choose between plain text and JSON formatting for
  both console and file logging.
- **Console Styling:** Enhance readability with colors, bold, dim, and other
  styles in console output.
- **Cross-Runtime Compatibility** Works seamlessly across Node.js, Deno, and Bun
  environments.
- **Modular Transports:** Easily create custom transports to send logs to
  console, file or cloud services like Splunk HEC or New Relic.
- **Global and Transport Filtering:** Set log levels globally or configure
  fine-grained filtering per transport.

### Example Usage

#### Console + File Transport

```javascript
import { ConsoleLogger, FileLogger, Log, Severity } from "./mod.ts";

const myLogger = new Log([
  new ConsoleLogger({
    // Only write severity Info and higher to console
    minimumSeverity: Severity.Info,
    // Also possible to select individual severities
    // severities: [Severity.Info, Severity.Error]
  }),
  new FileLogger({
    filePath: "./app.log",
    fileFormat: "txt",
  }),
]);

myLogger.debug("Initializing application...");
myLogger.warn("Received a potentially invalid request");
try {
  // ... code that might fail
} catch (error) {
  myLogger.error("Critical failure!", error);
}
```

#### Splunk HEC Transport

1. **Obtain Splunk HEC endpoint and token:**
   - Log into your Splunk instance.
   - Navigate to **Settings > Data Inputs > HTTP Event Collector**.
   - Create a new input or locate an existing one, noting its endpoint URL and
     token.

2. **Integrate the Splunk HEC Transport:**

```javascript
import { ConsoleLogger, Log, Severity, SplunkHecClient } from "@cross/log";

const myLogger = new Log([
  new ConsoleLogger({ minimumSeverity: Severity.Info }),
  new SplunkHecClient({
    hecEndpoint: "https://splunk-server:8088/services/collector",
    hecToken: "your-splunk-hec-token",
    sourceType: "my_app_logs", // Adjust as needed
  }),
]);

myLogger.debug("Initializing application...");
myLogger.warn("Received a potentially invalid request");
try {
  // ... code that might fail
} catch (error) {
  myLogger.error("Critical failure!", error);
}
```

#### New Relic transport

**Configuration**

The `NewRelicLogger` transport requires the following options:

- **`apiKey`:** Your New Relic license key or API key.
- **`region`:** (Optional) The New Relic region where your account is located.
  Valid values are "US", "EU", and "FedRamp". Defaults to "US".
- **`serviceAttribute`:** (Optional) A common attribute name to identify the
  service generating the logs.
- **`logtypeAttribute`:** (Optional) A common attribute name to categorize your
  log entries.
- **`hostnameAttribute`:** (Optional) A common attribute name to indicate the
  host where the logs originated.

**Example**

```javascript
import { Log, NewRelicLogger } from "@cross/log";

const logger = new Log([
  // ... other transports (ConsoleLogger, FileLogger, etc.)

  new NewRelicLogger({
    apiKey: "your-new-relic-api-key",
    region: "EU",
    serviceAttribute: "my-awesome-app",
    logtypeAttribute: "application-logs",
    hostnameAttribute: "production-server-1",
  }),
]);

logger.warn("User successfully logged in");
```

**Important Notes**

- **Obtain your API Key:** You can find your New Relic license key or API key
  within your New Relic account settings.
- **Custom Attributes:** The `serviceAttribute`, `logtypeAttribute` and
  `hostnameAttribute` help you organize and filter your logs within New Relic.
- **Error Handling:** Consider robust error handling for your New Relic
  transport (e.g., storing logs temporarily in a file if the New Relic API is
  unavailable).

#### Creating a custom transport

```ts
import { Log, LogTransportBase, LogTransportBaseOptions } from "@cross/log";
import { Severity } from "@cross/log";

/**
 * Create your own Transport by extending LogTransportBase
 */
export class CustomLogger extends LogTransportBase {
  options: LogTransportBaseOptions;
  constructor(options?: LogTransportBaseOptions) {
    super();
    this.options = { ...this.defaults, ...options };
  }
  log(level: Severity, scope: string, data: unknown[], timestamp: Date) {
    if (this.shouldLog(level)) {
      // Custom implementation below
      const formattedMessage = `${timestamp.toISOString()} ${level} ${scope} ${
        data.join(" ")
      }`;
      if (level === Severity.Error) {
        console.error(formattedMessage);
      } else {
        console.log(formattedMessage);
      }
    }
  }
}

// Create a new logger, using our custom logger
const logger = new Log([new CustomLogger()]);

// Log a message
logger.warn("This is a warning");
```

**Contributions and Feedback**

We welcome your contributions to improve `@cross/log`! Submit issues, feature
requests, or pull requests on the GitHub repository:
[https://github.com/cross-org/log](https://github.com/cross-org/log).
