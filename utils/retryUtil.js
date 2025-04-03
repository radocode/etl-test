const axios = require("axios");

async function fetchWithRetry(url, retries = 3) {
  let attempt = 0;
  // use for loop to retry 3 times at most
  while (attempt < retries) {
    try {
      const response = await axios.get(url);
      return response.data; // Success: Return data
    } catch (error) {
      attempt++;
      console.log(`Attempt ${attempt} failed. Retrying...`);
      if (attempt === retries) {
        throw error; // Fail after exhausting retries
      }
    }
  }
}

module.exports = fetchWithRetry