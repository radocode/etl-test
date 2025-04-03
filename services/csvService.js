const fs = require("fs").promises;
const { createObjectCsvWriter } = require("csv-writer");
const logger = require("../utils/logger");
const path = require("path");

const header = [{ id: "name", title: "University Name" },
                    { id: "country", title: "Country" },                    
                    { id: "web_pages", title: "Website" },
                ]

// Generates CSV from the stored JSON file
async function generateCsv(csvFile) {
    try {
        const str = path.resolve(__dirname, "..","universities.json");
        const data = await fs.readFile(str, "utf8");
        const universities = JSON.parse(data);

        const csvWriter = createObjectCsvWriter({
            path: csvFile,
            header,
        });

        const records = universities?.map((u) => ({
            name: u.name || "",
            country: u.country || "",            
            web_pages: u.web_pages[0] || "",            
        }));

        await csvWriter.writeRecords(records);
        logger.info(`CSV file generated at: ${csvFile}`);
    } catch (error) {
        logger.error({ error: error.message }, "Failed to generate CSV");
        throw error;
    }
}

module.exports = { generateCsv };
