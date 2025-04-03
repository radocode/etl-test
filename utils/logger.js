const pino = require("pino");

const logger = pino({
    transport: process.env.NODE_ENV === "development" ? { target: "pino-pretty" } : undefined,
    level: "info", // Adjust the log level as needed (e.g., "debug", "warn", "error")
});

module.exports = logger;
