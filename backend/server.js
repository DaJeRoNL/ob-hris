const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dns = require('dns');

const app = express();
const PORT = process.env.PORT || 4000; 
const DB_URL = process.env.DATABASE_URL;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

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

    // Health check endpoint
    app.get('/health', async (req, res) => {
        let client;
        try {
            client = await pool.connect();
            const result = await client.query('SELECT NOW() AS now');
            res.status(200).json({
                status: 'ok',
                database: 'connected',
                timestamp: result.rows[0].now
            });
        } catch (err) {
            console.error('Database connection error', err);
            res.status(500).json({
                status: 'error',
                database: 'disconnected',
                error: err.message
            });
        } finally {
             if (client) client.release();
        }
    });

    // Root endpoint
    app.get('/', async (req, res) => {
        let client;
        try {
            client = await pool.connect();
            const result = await client.query('SELECT NOW() AS now');
            res.status(200).send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>HRIS Backend API</title>
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            min-height: 100vh;
                            margin: 0;
                            padding: 20px;
                        }
                        .container {
                            background: rgba(255, 255, 255, 0.1);
                            backdrop-filter: blur(10px);
                            border-radius: 20px;
                            padding: 40px;
                            max-width: 600px;
                            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                        }
                        h1 {
                            margin: 0 0 10px 0;
                            font-size: 2.5rem;
                        }
                        .status {
                            display: inline-block;
                            background: #10b981;
                            padding: 8px 16px;
                            border-radius: 20px;
                            font-size: 0.9rem;
                            font-weight: 600;
                            margin: 20px 0;
                        }
                        .info {
                            background: rgba(255, 255, 255, 0.1);
                            padding: 15px;
                            border-radius: 10px;
                            margin: 15px 0;
                        }
                        .info p {
                            margin: 8px 0;
                        }
                        code {
                            background: rgba(0, 0, 0, 0.3);
                            padding: 2px 8px;
                            border-radius: 4px;
                            font-family: 'Courier New', monospace;
                        }
                        a {
                            color: #fbbf24;
                            text-decoration: none;
                        }
                        a:hover {
                            text-decoration: underline;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>🚀 HRIS Backend API</h1>
                        <div class="status">✓ Running</div>
                        
                        <div class="info">
                            <p><strong>Database Status:</strong> Connected ✓</p>
                            <p><strong>Database Time:</strong> ${result.rows[0].now}</p>
                            <p><strong>IPv4 Address:</strong> ${ipv4Address}</p>
                        </div>

                        <div class="info">
                            <p><strong>API Endpoints:</strong></p>
                            <p>• <code>GET /health</code> - Health check</p>
                            <p>• <code>GET /</code> - This page</p>
                        </div>

                        <p style="margin-top: 30px; opacity: 0.8;">
                            <small>Powered by Express.js + PostgreSQL (Supabase)</small>
                        </p>
                    </div>
                </body>
                </html>
            `);
        } catch (err) {
            console.error('Database connection error', err);
            res.status(500).send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>HRIS Backend - Error</title>
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            background: #ef4444;
                            color: white;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            min-height: 100vh;
                            margin: 0;
                            padding: 20px;
                        }
                        .container {
                            background: rgba(0, 0, 0, 0.3);
                            backdrop-filter: blur(10px);
                            border-radius: 20px;
                            padding: 40px;
                            max-width: 600px;
                        }
                        h1 { margin: 0 0 20px 0; }
                        code {
                            background: rgba(0, 0, 0, 0.5);
                            padding: 2px 8px;
                            border-radius: 4px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>❌ Database Connection Error</h1>
                        <p>Failed to connect to Supabase database.</p>
                        <p><strong>Error:</strong> <code>${err.message}</code></p>
                    </div>
                </body>
                </html>
            `);
        } finally {
             if (client) client.release();
        }
    });

    // Start the Server
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Database connected via IPv4: ${ipv4Address}`);
    });
}

setupDatabaseAndStartServer();