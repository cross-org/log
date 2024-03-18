**@cross/log - Cross-Runtime Logging for Node.js, Deno, and Bun**

**This is work in progress**

**Installation**

Instructions are available at
[https://jsr.io/@cross/log](https://jsr.io/@cross/log) (adjust as needed).
Here's the quick version:

```bash
# Deno
deno add https://jsr.io/@cross/log

# Node.js
npx jsr add @cross/log

# Bun
bunx jsr add @cross/log
```

**Key Features**

- **Flexible Log Levels:** Use standard log levels (Debug, Info, Warn, Error)
  for easy categorization.
- **Customizable Output:** Format log messages for both console and files, with
  support for plain text or JSON formatting.
- **Console Styling:** Apply colors and styles (bold, dim, etc.) in the console,
  enhancing log readability.
- **Cross-Runtime:** Works seamlessly in Node.js, Deno, and Bun environments.
- **Global Filtering:** Set a minimum log level to control which messages are
  processed.

**Core Classes**

- **Log**
  - `debug(message: string)`
  - `info(message: string)`
  - `warn(message: string)`
  - `error(message: string)`

**Example Usage**

```javascript
import { Log, LogLevel } from "@cross/log";

// Create a logger with file output and console styling
const logger = new Log({
  file: {
    enabled: true,
    stdoutPath: "./app.log",
    stderrPath: "./errors.log", // Optional, will by default write errors to stdoutPath
  },
  logLevel: LogLevel.Debug, // Enable all levels
});

logger.debug("Initializing application...");
logger.info("Database connection established");
logger.warn("Received a potentially invalid request");
logger.error("Critical failure - shutting down!");
```

**Contributions and Feedback**

The `@cross/log` project is open to contributions and feedback. Feel free to
submit issues, feature requests, or pull requests on the GitHub repository:
[https://github.com/cross-org/log](https://github.com/cross-org/log).
