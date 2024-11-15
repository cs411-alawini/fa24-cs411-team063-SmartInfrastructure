const mysql = require('mysql2');
const express = require('express');
const app = express();

// load .env file (has sensitive info)
require('dotenv').config();

// middleware to allow req to have nice and neat attributes
app.use(express.json())


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

// GET call for players
app.get('/api/players', (req, res) => {
    const { first_name, last_name, position, team_id, draft_year, person_id } = req.query;

    // Create the SQL query
    let sql = 'SELECT * FROM players WHERE 1=1';
  const params = [];

  // Dynamically add conditions based on provided parameters
  if (first_name) {
    sql += ' AND first_name LIKE ?';
    params.push(`%${first_name}%`);
  }
  if (last_name) {
    sql += ' AND last_name LIKE ?';
    params.push(`%${last_name}%`);
  }
  if (position) {
    sql += ' AND position LIKE ?';
    params.push(`%${position}%`);
  }
  if (team_id) {
    sql += ' AND team_id = ?';
    params.push(Number(team_id));
  }
  if (draft_year) {
    sql += ' AND draft_year = ?';
    params.push(Number(draft_year));
  }
  if (person_id) {
    sql += ' AND person_id = ?';
    params.push(Number(person_id));
  }


    pool.query(sql, params, (err, results) => {
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