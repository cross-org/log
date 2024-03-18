**@cross/log - Generic logger for Node.js, Deno, and Bun**

**Installation**

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

**Getting Started**

**Simplest Use Case**

```javascript
import { Log } from "@cross/log";

const logger = new Log(); // Uses ConsoleLogger with default settings by default

logger.info("Hello log!");
```

**Key Features**

- **Flexible Log Levels:** Use standard log levels (Debug, Info, Warn, Error)
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

**Core Classes**

- **Log:** Central class for managing log transports and dispatching log
  messages.
  - `debug(message: string)`
  - `info(message: string)`
  - `warn(message: string)`
  - `error(message: string)`

**Example Usage (with Custom Transports)**

```javascript
import { ConsoleLogger, FileLogger, Log, LogLevel } from "./mod.ts";

const myLogger = new Log([
  new ConsoleLogger({
    logLevel: LogLevel.Debug, // Include debug in console output
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

**Contributions and Feedback**

We welcome your contributions to improve `@cross/log`! Submit issues, feature
requests, or pull requests on the GitHub repository:
[https://github.com/cross-org/log](https://github.com/cross-org/log).
