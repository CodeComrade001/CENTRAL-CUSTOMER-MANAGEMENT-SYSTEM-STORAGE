// src/utils/logger.ts
const isProduction = process.env.NODE_ENV === "production";

type LogLevel = "debug" | "info" | "warn" | "error";

function log(level: LogLevel, message: string, ...meta: any[]) {
  const timestamp = new Date().toISOString();

  // In prod, suppress debug logs
  if (isProduction && level === "debug") return;

  switch (level) {
    case "debug":
      console.debug(`[DEBUG] ${timestamp}: ${message}`, ...meta);
      break;
    case "info":
      console.info(`[INFO] ${timestamp}: ${message}`, ...meta);
      break;
    case "warn":
      console.warn(`[WARN] ${timestamp}: ${message}`, ...meta);
      break;
    case "error":
      console.error(`[ERROR] ${timestamp}: ${message}`, ...meta);
      break;
  }
}

export const logger = {
  debug: (msg: string, ...meta: any[]) => log("debug", msg, ...meta),
  info: (msg: string, ...meta: any[]) => log("info", msg, ...meta),
  warn: (msg: string, ...meta: any[]) => log("warn", msg, ...meta),
  error: (msg: string, ...meta: any[]) => log("error", msg, ...meta),
};
