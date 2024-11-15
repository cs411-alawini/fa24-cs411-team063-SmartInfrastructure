const mysql = require('mysql2');
const express = require('express');
const app = express();

// load .env file (has sensitive info)
require('dotenv').config();

// middleware to allow req to have nice and neat attributes
app.use(express.json())

const pool = mysql.createPool({
    // environment variable info (sensitive data)
    host: process.env.DB_HOST || 'YOUR_INSTANCE_IP_ADDRESS',
    user: process.env.DB_USER || 'YOUR_DB_USER',
    password: process.env.DB_PASSWORD || 'YOUR_DB_PASSWORD',
    database: process.env.DB_NAME || 'YOUR_DATABASE_NAME',

    // pool configurations
    waitForConnections: true, // pool will wait for connections if none are available
    connectionLimit: 10, // max # of connections
    queueLimit: 0, // unlimited # of queued requests if no connections are available
});

app.get('/api/players', (req, res) => {
    pool.query('SELECT * FROM players', (err, results) => {
        // error catching
        if (err) {
        console.error('Error fetching players:', err);
        return res.status(500).send('An error occurred while fetching users.');
        }
        // return results if no error
        res.json(results);
    });
});

// test route
app.get('/', (req, res) => {
    // response which is sent
    res.send('Server is running!');
});
  
// Start the server and listen on a specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});