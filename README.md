# **ETL API with Node.js & Express**  

This project is an **ETL (Extract, Transform, Load) API** that:  
- Fetches **university data** from `http://universities.hipolabs.com`
- Stores the data as **JSON** and **CSV**
- Allows users to **download the CSV**
- Runs a **scheduled job** to refresh data **daily at midnight UTC**  

## **Features**
- REST API with **Express.js**
- **Pino** logging for debugging
- **Cron job** for automatic daily data refresh
## **Installation**

### **Clone the repository**
```sh
git clone https://github.com/radocode/etl-test.git
cd etl-test
```

### **Install dependencies**
```sh
npm install
```

### **Create a `.env` file (optional)**
```sh
NODE_ENV=development
```

### **Run the server (Development)**
```sh
npm run dev
```
This starts the server on **http://localhost:3000/** using **nodemon** in development mode.

### **Run the server (Production)**
```sh
npm run start
```
This starts the server on **http://localhost:3000/**.

## **API Endpoints**

### **Fetch & Store University Data**
#### **GET `/fetch?name=<name>&country=<country>`**
- Fetches university data from the API and stores it as `.data/universities.json`.
- **Example Request:**
  ```sh
  curl "http://localhost:3000/fetch?name=middle&country=United%20States"
  ```
- **Response:**
  ```json
  {
    "message": "Data fetched and stored successfully!"
  }
  ```

### **Download University Data (CSV)**
#### **GET `/download`**
- Returns the latest `universities.csv` file.
- **Example Request:**
  ```sh
  curl -O http://localhost:3000/download
  ```
- **Response:**
  - A CSV file is downloaded.

## **Scheduled Data Refresh**
- A **cron job** runs **every day at midnight UTC** to refresh the university data.
- This calls the same `/fetch` API **automatically**.

## **Tech Stack**
- **Node.js** + **Express.js**
- **Pino** (logging)
- **node-cron** (scheduler)
- **csv-writer** (CSV generation)
- **nodemon** (hot-reloading)

## **Improving Data Quality & Process**  

To enhance the data quality and processing, we can:  

### **1. Data Validation & Cleaning**
- Trim whitespace from names and web pages.  
- Normalize country names (e.g., "USA" → "United States") and validate them against a normalized dictionary.  
- Ensure valid URLs (only `http(s)://` links).  
- Remove duplicates before storing by creating an util function (easier to test independently).  

### **2. API Enhancements**
- Rate limiting to avoid API abuse (maybe with `express-rate-limit`).  
- Caching responses (in Redis) to reduce unnecessary requests.  
- Retries with exponential backoff (already implemented in `fetchWithRetry`).
- URLs of external APIs and filenames should be inside the .env file (maybe using `dotenv`).

### **3. Error Handling**
- Graceful fallbacks: If the API fails, return the last saved data.  
- Logging and alerts: Detect failures via Pino logs and send notifications.  

## **Database Design**  

A simple relational database (PostgreSQL/MySQL) structure works best:  

### **Database Schema (SQL)**
```sql
CREATE TABLE universities (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    web_page TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Alternative NoSQL Approach (MongoDB)**
If we choose MongoDB, the document structure would look like this:
```json
{
    "_id": "unique_id",
    "name": "Middlebury College",
    "country": "United States",
    "web_page": "http://www.middlebury.edu/",
    "updated_at": "2025-04-03T00:00:00Z"
}
```
## **Upsert Strategy (Prevent Duplicates)**  

### **1. SQL Upsert (PostgreSQL/MySQL)**
To avoid duplicate universities, we use `ON CONFLICT`:  
```sql
INSERT INTO universities (name, country, web_page) 
VALUES ('Middlebury College', 'United States', 'http://www.middlebury.edu/')
ON CONFLICT (web_page) 
DO UPDATE SET name = EXCLUDED.name, country = EXCLUDED.country, updated_at = CURRENT_TIMESTAMP;
```
This ensures:  
- New records are inserted  
- Existing records are updated instead of duplicated  

### **2. MongoDB Upsert**
For MongoDB, we use `updateOne` with `{ upsert: true }`:  
```javascript
db.universities.updateOne(
    { web_page: "http://www.middlebury.edu/" }, 
    { $set: { name: "Middlebury College", country: "United States", updated_at: new Date() } }, 
    { upsert: true }
);
```
This ensures:  
- If the university exists, it is updated  
- If it does not exist, a new document is inserted
