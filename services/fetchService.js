const fs = require("fs").promises;
const fetchWithRetry = require("../utils/retryUtil");
const logger = require("../utils/logger");

const DATA_FILE = "universities.json";
const API_URL = "http://universities.hipolabs.com/search";

// Fetches data and stores it in a JSON file
async function fetchAndStoreData(name, country) {
    try {
        const universities = await fetchWithRetry(`${API_URL}?name=${name}&country=${country}`);
        fs.writeFile(DATA_FILE, JSON.stringify(universities, null, 2));
        logger.info(`Fetched ${universities.length} universities and stored in ${DATA_FILE}`);

        return universities;
    } catch (error) {
        logger.error({ error: error.message }, "Failed to fetch and store data");
        throw error;
    }
}

module.exports = { fetchAndStoreData };