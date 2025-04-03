const express = require("express");
const cron = require("node-cron");
const fetchRoutes = require("./routes/fetchRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const { fetchAndStoreData } = require("./services/fetchService");
const logger = require("./utils/logger");

const app = express();
const PORT = 3000;

// Middleware for logging
app.use((req, res, next) => {
    logger.info({ method: req.method, url: req.url }, "Incoming request");
    next();
});

// Use routes
app.use(fetchRoutes);
app.use(downloadRoutes);

// Schedule the fetch function to run at midnight UTC
cron.schedule("0 0 * * *", async () => {
    try {
        logger.info("Scheduled data refresh started...");
        await fetchAndStoreData("middle", "United States");
        logger.info("Data successfully refreshed at midnight UTC.");
    } catch (error) {
        logger.error({ error: error.message }, "Scheduled data refresh failed.");
    }
});

logger.info("Scheduler initialized: Data will refresh at midnight UTC.");

// Start server
app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
});
