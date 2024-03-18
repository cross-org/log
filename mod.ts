/**
 * Re-export of common transports
 *
 * All transports is available by using
 *
 * ```
 * import { FileLogger } from "@cross/log/file";
 * import { ConsoleLogger } from "@cross/log/console";
 * // ... etc
 * ```
 */
export { Log } from "./src/log.ts";
export { Severity } from "./src/types.ts";
export { ConsoleLogger } from "./transports/console.ts";
export { FileLogger } from "./transports/file.ts";
