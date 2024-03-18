import { appendFile } from "node:fs/promises";
import { Colors } from "@cross/utils";
import { deepMerge } from "@cross/deepmerge";

export type LoggerFileFormat = "txt" | "json";

export interface LoggerOptions {
  file?: {
    enabled: boolean;
    stdoutPath?: string;
    stderrPath?: string;
    format?: LoggerFileFormat;
  };
  console?: {
    enabled: boolean;
  };
  logLevel?: LogLevel;
}

export enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Log = "LOG",
  Warn = "WARN",
  Error = "ERROR",
}

const numericLogLevel = new Map([
  ["DEBUG", 100],
  ["INFO", 200],
  ["LOG", 300],
  ["WARN", 400],
  ["ERROR", 500],
]);

export class Log {
  private options: LoggerOptions;

  constructor(options?: LoggerOptions) {
    const defaults: LoggerOptions = {
      file: {
        enabled: false,
        stdoutPath: "./app.log",
        stderrPath: "./app.log",
        format: "txt",
      },
      console: { enabled: true },
      logLevel: LogLevel.Info,
    };
    this.options = deepMerge(defaults, options)!;
  }

  debug(message: string) {
    this.doLog(LogLevel.Debug, message);
  }

  info(message: string) {
    this.doLog(LogLevel.Info, message);
  }

  log(message: string) {
    this.doLog(LogLevel.Log, message);
  }

  warn(message: string) {
    this.doLog(LogLevel.Warn, message);
  }

  error(message: string) {
    this.doLog(LogLevel.Error, message);
  }

  private doLog(level: LogLevel, message: string) {
    if (this.shouldLog(level)) { // Introduce filtering check
      const timestamp = new Date();
      if (this.options.file?.enabled) {
        if (this.options.file?.stderrPath && level === LogLevel.Error) {
          this.appendToFile(timestamp, level, message, true);
        } else if (this.options.file?.stdoutPath) {
          this.appendToFile(timestamp, level, message, false);
        }
      }
      if (this.options.console?.enabled) {
        this.writeToConsole(timestamp, message, level);
      }
    }
  }

  private appendToFile(
    timestamp: Date,
    level: LogLevel,
    message: string,
    stderr: boolean,
  ) {
    const timestampText = timestamp.toISOString();
    const formattedMessage = this.formatFileMessage(
      timestampText,
      level,
      message,
    );
    const filePath = stderr
      ? this.options.file!.stderrPath
      : this.options.file!.stdoutPath;
    appendFile(filePath as string, formattedMessage)
      .catch((err) => console.error(`Error writing to log file:`, err));
  }

  private formatFileMessage(
    timestamp: string,
    level: LogLevel,
    message: string,
  ): string {
    switch (this.options.file?.format) {
      case "json":
        return JSON.stringify({ timestamp, level, message }) + "\n";
      default:
        return `[${timestamp}] [${level}] ${message}\n`; // Default remains the same
    }
  }

  private writeToConsole(timestamp: Date, message: string, level: LogLevel) {
    const timestampText = Colors.dim(timestamp.toISOString());

    let styledLevel = level.toString().padEnd(5, " ");

    switch (level) {
      case LogLevel.Debug:
        styledLevel = Colors.dim(styledLevel);
        message = Colors.dim(message);
        break;
      case LogLevel.Info:
        styledLevel = Colors.blue(styledLevel);
        break;
      case LogLevel.Warn:
        styledLevel = Colors.yellow(styledLevel);
        break;
      case LogLevel.Error:
        styledLevel = Colors.red(styledLevel);
        message = Colors.red(message);
        break;
    }

    const formattedMessage = `${timestampText} ${styledLevel} ${message}`;

    if (level === LogLevel.Error) {
      console.error(formattedMessage);
    } else {
      console.log(formattedMessage);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const currentLogLevel = this.options.logLevel ?? LogLevel.Debug;
    return numericLogLevel.get(level)! >= numericLogLevel.get(currentLogLevel)!;
  }
}
