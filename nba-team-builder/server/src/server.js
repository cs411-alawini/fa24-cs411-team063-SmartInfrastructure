const mysql = require('mysql2');
const express = require('express');
const app = express();

// load .env file (has sensitive info)
require('dotenv').config();

// middleware to allow req to have nice and neat attributes
app.use(express.json())


const cors = require('cors');
// Enable CORS for all origins
app.use(cors());

// connection pool for connecting to MySQL database
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

// Search Bar Endpoint
app.get('/api/players', (req, res) => {
  const { first_name } = req.query;

  if (!first_name) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  // Split search term by spaces
  const terms = first_name.split(' ');
  let sql = `
    SELECT 
      players.*
    FROM 
      players 
    WHERE 1=1
  `;
  const params = [];

  if (terms.length === 1) {
    // Single term: match either first or last name, or the combined first and last name
    sql += ' AND (players.first_name LIKE ? OR players.last_name LIKE ? OR players.first_and_last_name LIKE ?)';
    params.push(`%${terms[0]}%`, `%${terms[0]}%`, `%${terms[0]}%`);
  } else if (terms.length >= 2) {
    // Two terms: match the exact first_and_last_name or separately match first and last name
    sql += ' AND (players.first_and_last_name LIKE ? OR (players.first_name LIKE ? AND players.last_name LIKE ?))';
    params.push(`%${terms.join(' ')}%`, `%${terms[0]}%`, `%${terms[1]}%`);
  }

  // additional filter to not display accidental uploaded data
  sql += ` AND players.first_and_last_name != ?`;
  params.push('first_and_last_name');

  pool.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error fetching players:', err);
      return res.status(500).send('An error occurred while fetching players.');
    }

    res.json(results); // Return all matched results with detailed information
  });
});


// test route
app.get('/', (req, res) => {
    // response which is sent
    res.send('Server is running!');
});
  
// Start the server and listen on a specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});