const express = require("express");
const { generateCsv } = require("../services/csvService");
const logger = require("../utils/logger");
const path = require("path");

const router = express.Router();

router.get("/download", async (req, res) => {
    try {        
        const universitiesCsv = path.resolve(__dirname, "..","universities.csv")
        
        logger.info("CSV regenerating...");
        await generateCsv(universitiesCsv);        

        res.download(universitiesCsv, (err) => {
            if (err) {
                logger.error({ error: err.message }, "Error sending CSV file");
                res.status(500).json({ error: "Error downloading file" });
            }
        });
    } catch (error) {
        logger.error({ error: error.message }, "Failed to process CSV download");
        res.status(500).json({ error: "Failed to download CSV" });
    }
});

module.exports = router;
