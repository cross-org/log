**@cross/log - Generic logger for Node.js, Deno, and Bun**

## Installation

Instructions are available at
[https://jsr.io/@cross/log](https://jsr.io/@cross/log). Here's the quick
version:

```bash
# Deno
deno add @cross/log

# Node.js
npx jsr add @cross/log

# Bun
bunx jsr add @cross/log
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
  databases, network services, or specialized systems.
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

**Contributions and Feedback**

We welcome your contributions to improve `@cross/log`! Submit issues, feature
requests, or pull requests on the GitHub repository:
[https://github.com/cross-org/log](https://github.com/cross-org/log).
