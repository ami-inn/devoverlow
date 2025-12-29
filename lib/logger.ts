import pino from "pino";

const isEdge = process.env.NEXT_RUNTIME === "edge"; // Edge runtime check
const isProduction = process.env.NODE_ENV === "production"; // Production environment check

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    !isEdge && !isProduction
      ? {
          target: "pino-pretty", // Pretty print for non-production server environments
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "SYS:standard",
          },
        }
      : undefined,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;