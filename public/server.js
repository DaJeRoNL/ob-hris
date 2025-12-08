const express = require('express');
const { Pool } = require('pg');
const dns = require('dns');
const url = require('url');

const app = express();
const PORT = process.env.PORT || 4000; 
const DB_URL = process.env.DATABASE_URL;

// Function to force IPv4 lookup
const resolveHostname = (hostname) => {
    return new Promise((resolve, reject) => {
        dns.lookup(hostname, 4, (err, address) => {
            if (err) return reject(err);
            resolve(address);
        });
    });
};

async function setupDatabaseAndStartServer() {
    
    if (!DB_URL) {
        console.error("DATABASE_URL environment variable is not set.");
        return;
    }
    
    // Parse the connection string to get the hostname
    const parsedUrl = new URL(DB_URL);
    
    // Resolve the hostname to an IPv4 address
    const ipv4Address = await resolveHostname(parsedUrl.hostname);
    console.log(`Resolved hostname ${parsedUrl.hostname} to IPv4: ${ipv4Address}`);

    // Create a new connection string using the resolved IPv4 address
    const finalConnectionString = DB_URL.replace(parsedUrl.hostname, ipv4Address);
    
    const pool = new Pool({
        connectionString: finalConnectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    // Test Route
    app.get('/', async (req, res) => {
        let client;
        try {
            client = await pool.connect();
            const result = await client.query('SELECT NOW() AS now');
            res.status(200).send(`
                <h1>HRIS Web App is RUNNING!</h1>
                <p>Database Time: ${result.rows[0].now}</p>
                <p>Connection to Supabase successful via IPv4: ${ipv4Address}.</p>
            `);
        } catch (err) {
            console.error('Database connection error', err);
            res.status(500).send(`
                <h1>HRIS Web App Error</h1>
                <p>Failed to connect to Supabase database.</p>
                <p>Error: ${err.message}</p>
            `);
        } finally {
             if (client) client.release();
        }
    });

    // Start the Server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
}

setupDatabaseAndStartServer();