
const express = require("express");
const { fetchAndStoreData } = require("../services/fetchService");
const logger = require("../utils/logger");

const router = express.Router();

router.get("/fetch", async (req, res) => {
    try {
        const { name, country } = req.query;
        if (!name || !country) {
            return res.status(400).json({ error: "Missing name or country parameters." });
        }

        fetchAndStoreData(name, country);
        res.json({ message: "Data fetched and stored successfully!" });
    } catch (error) {
        logger.error({ error: error.message }, "Fetch request failed");
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

module.exports = router;
