/**
 * Re-export of common features
 */
export { Log } from "./src/log.ts";
export { Severity } from "./src/types.ts";

/**
 * Re-export of common transports
 */
export { ConsoleLogger } from "./transports/console.ts";
export { FileLogger } from "./transports/file.ts";

/**
 * Re-export of transport classes
 */
// deno-lint-ignore-file
export { LogTransportBase } from "./transports/base.ts";
export type { LogTransportBaseOptions } from "./transports/base.ts";
