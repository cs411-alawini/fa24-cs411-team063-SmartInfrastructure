const mysql = require('mysql2/promise');
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

// Player Search Bar Endpoint
app.get('/api/players', async (req, res) => {
  const { first_name } = req.query;

  if (!first_name) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  try {
    // Split search term by spaces
    const terms = first_name.split(' ');
    let sql = `
      SELECT 
        players.*,
        teams.team_id, teams.team_name
      FROM 
        players
      LEFT JOIN
        teams
      ON
        players.team_id = teams.team_id
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

    // Additional filter to not display accidental uploaded data
    sql += ` AND players.first_and_last_name != ?`;
    params.push('first_and_last_name');

    // Execute the query using Promises
    const [results] = await pool.query(sql, params);
    res.json(results); // Return all matched results with detailed information
  }
  
  catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).json({ error: 'An error occurred while fetching players.' });
  }
});




// Team Validation Post Endpoint
app.post('/api/validate-team', async (req, res) => {
  const { team, criteria, logicalOperator = "AND" } = req.body;

  // Check if team has exactly 5 players
  if (!team || team.length !== 5) {
    return res.status(400).json({ error: "Team must contain exactly 5 players" });
  }

  // Check if the criteria is valid or not
  if (!criteria || !Array.isArray(criteria) || criteria.length === 0) {
    return res.status(400).json({ error: "Criteria is required and must include valid stat comparisons" });
  }

  try {
    // Dynamically construct WHERE clauses based on criterion
    const whereClauses = criteria.map(
      (criterion) => `AVG(player_stats.${criterion.stat}) ${criterion.operator} ${criterion.value}`
    );

    // Dynamically joins clauses based on OR or AND
    const havingCondition =
      logicalOperator === "OR"
        ? `(${whereClauses.join(" OR ")})`
        : whereClauses.join(" AND ");

    // SQL query to calculate averages and validate players
    const sql = `
      SELECT 
        players.player_id,
        players.salary,
        ${criteria
          .map((criterion) => `AVG(player_stats.${criterion.stat}) AS avg_${criterion.stat}`)
          .join(", ")}
      FROM players
      LEFT JOIN player_stats ON players.player_id = player_stats.player_id
      WHERE players.player_id IN (?)
      GROUP BY players.player_id, players.salary
    `;

    // Execute the query using async/await
    const [results] = await pool.query(sql, [team]);

    // Evaluate results to calculate penalties for invalid players
    const evaluatedTeam = team.map((playerId) => {
      const playerData = results.find((p) => p.player_id === playerId);

      if (!playerData) {
        // If a player is missing in the results, ensure they are still returned with default values
        return {
          player_id: playerId,
          valid: false,
          penalty: 1000000,
          salary: null,
          team_name: null,
          stats: criteria.reduce((acc, criterion) => {
            acc[criterion.stat] = null; // No stats available
            return acc;
          }, {}),
        };
      }

      // Check if the player meets the criteria
      const valid = criteria.every((criterion) => {
        const statValue = parseFloat(playerData[`avg_${criterion.stat}`]);
        switch (criterion.operator) {
          case ">": return statValue > criterion.value;
          case ">=": return statValue >= criterion.value;
          case "<": return statValue < criterion.value;
          case "<=": return statValue <= criterion.value;
          case "=": return statValue === criterion.value;
          default: return false;
        }
      });

      return {
        player_id: playerData.player_id,
        valid,
        penalty: valid ? 0 : 10000000, // $10 mil penalty for now
        salary: parseFloat(playerData.salary),
        team_name: playerData.team_name,
        stats: criteria.reduce((acc, criterion) => {
          acc[criterion.stat] = parseFloat(playerData[`avg_${criterion.stat}`]);
          return acc;
        }, {}),
      };
    });

    // Calculate total salary and penalties
    let totalSalary = 0;
    for (const player of evaluatedTeam) {
      totalSalary += player.salary || 0;
    }

    // Calculate total penalty using a for loop
    let totalPenalty = 0;
    for (const player of evaluatedTeam) {
      totalPenalty += player.penalty;
    }

    // Calculate the final cost
    const finalCost = totalSalary + totalPenalty;


    // Determine overall validity
    const allValid = evaluatedTeam.every((p) => p.valid);

    // Send the response
    res.json({
      valid: allValid,
      team: evaluatedTeam,
      total_salary: totalSalary,
      total_penalty: totalPenalty,
      final_cost: finalCost,
    });
  } catch (err) {
    console.error("Error validating team:", err);
    res.status(500).json({ error: "An error occurred while validating the team." });
  }
});

// Route to create a new account
// Route to create a new account
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if the email already exists
    const checkSql = `SELECT * FROM users WHERE email = ?`;
    const [existingUser] = await pool.query(checkSql, [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Save the new user
    const insertSql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    const [insertResult] = await pool.query(insertSql, [username, email, password]);

    // Retrieve the newly created user_id
    const user_id = insertResult.insertId;

    res.status(201).json({ message: 'User registered successfully', user_id });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to log in
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if the user exists
    const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
    const [results] = await pool.query(sql, [email, password]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Successful login
    const user = results[0];
    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// TEMP ENDPOINT FOR GETTING USERS
app.get('/api/users', async (req, res) => {
  try {
    // Define the SQL query
    const sql = 'SELECT * FROM users'; // Avoid selecting the password for security

    // Execute the query using the pool
    const [results] = await pool.query(sql);

    // Send the results as a JSON response
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
  


// Route to get all rosters
app.get('/api/rosters', async (req, res) => {
  try {
    // Query to fetch all rosters
    const sql = `
      SELECT r.roster_id, r.user_id, r.prompt_id, rp.player_id, r.total_salary, r.total_penalty
      FROM rosters r
      LEFT JOIN roster_players rp ON r.roster_id = rp.roster_id
    `;

    const [rows] = await pool.query(sql);

    // Organize the data: Group players by roster
    const rosters = rows.reduce((acc, row) => {
      const { roster_id, user_id, prompt_id, player_id, total_salary, total_penalty } = row;

      if (!acc[roster_id]) {
        // Initialize the roster object
        acc[roster_id] = { 
          roster_id, 
          user_id, 
          prompt_id, 
          total_salary, 
          total_penalty, 
          players: [] 
        };
      }

      // Add player_id to the players array
      if (player_id) {
        acc[roster_id].players.push(player_id);
      }

      return acc;
    }, {});

    res.status(200).json(Object.values(rosters)); // Send as an array
  } catch (error) {
    console.error('Error fetching rosters:', error);
    res.status(500).send('An error occurred while fetching rosters');
  }
});

// Route to get a specific user_id's roster
app.get('/api/rosters/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    // Query to fetch all rosters for a specific user_id
    const sql = `
      SELECT r.roster_id, r.user_id, r.prompt_id, rp.player_id, r.total_salary, r.total_penalty
      FROM rosters r
      LEFT JOIN roster_players rp ON r.roster_id = rp.roster_id
      WHERE r.user_id = ?
    `;

    const [rows] = await pool.query(sql, [user_id]);

    if (rows.length === 0) {
      return res.status(404).send({ message: `No rosters found for user_id: ${user_id}` });
    }

    // Organize the data: Group players by roster
    const rosters = rows.reduce((acc, row) => {
      const { roster_id, user_id, prompt_id, player_id, total_salary, total_penalty } = row;

      if (!acc[roster_id]) {
        // Initialize the roster object
        acc[roster_id] = { 
          roster_id, 
          user_id, 
          prompt_id, 
          total_salary, 
          total_penalty, 
          players: [] 
        };
      }

      // Add player_id to the players array
      if (player_id) {
        acc[roster_id].players.push(player_id);
      }

      return acc;
    }, {});

    res.status(200).json(Object.values(rosters)); // Send as an array
  } catch (error) {
    console.error('Error fetching rosters for user:', error);
    res.status(500).send('An error occurred while fetching rosters');
  }
});

// Route to create roster
app.post('/api/rosters', async (req, res) => {
  const { players, prompt_id, user_id, total_salary, total_penalty } = req.body;
  console.log(req.body);

  // Ensure required data is provided and valid
  if (
    prompt_id == null ||
    user_id == null ||
    total_salary == null ||
    total_penalty == null ||
    !Array.isArray(players)
  ) {
    return res.status(400).send('Invalid input data');
  }

  const connection = await pool.getConnection();

  try {
    // Start a transaction
    await connection.beginTransaction();

    // Insert the new roster into the `rosters` table
    const rosterSql = `
      INSERT INTO rosters (user_id, prompt_id, total_salary, total_penalty)
      VALUES (?, ?, ?, ?)
    `;
    const [rosterResult] = await connection.query(rosterSql, [
      user_id,
      prompt_id,
      total_salary,
      total_penalty,
    ]);

    // Get the new roster_id from the insert operation
    const roster_id = rosterResult.insertId;

    // Prepare the SQL for inserting player_ids into `roster_players`
    const rosterPlayersSql = `INSERT INTO roster_players (roster_id, player_id) VALUES ?`;
    const rosterPlayersValues = players.map((player_id) => [roster_id, player_id]);

    // Execute the batch insert for `roster_players`
    await connection.query(rosterPlayersSql, [rosterPlayersValues]);

    // Commit the transaction
    await connection.commit();

    res.status(201).send({ message: 'Roster created successfully', roster_id });
  } catch (error) {
    // Roll back the transaction in case of an error
    await connection.rollback();
    console.error(error);
    res.status(500).send('An error occurred while creating the roster');
  } finally {
    // Release the database connection
    connection.release();
  }
});

app.get('/api/explore-rosters', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 50) || 1;
    const limit = parseInt(req.query.limit, 50) || 50;
    const offset = (page - 1) * limit;

    // SQL Query with LIMIT and OFFSET
    const sql = `
      SELECT 
        r.roster_id, 
        r.user_id, 
        u.username, 
        r.prompt_id, 
        r.total_salary, 
        r.total_penalty,
        p.player_id,
        p.first_name,
        p.last_name,
        p.team_id,
        t.team_name,
        p.salary
      FROM rosters r
      LEFT JOIN users u ON r.user_id = u.user_id
      LEFT JOIN roster_players rp ON r.roster_id = rp.roster_id
      LEFT JOIN players p ON rp.player_id = p.player_id
      LEFT JOIN teams t ON p.team_id = t.team_id
      ORDER BY r.roster_id DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(sql, [limit, offset]);
    console.log(`Fetched ${rows.length} rows from DB for page ${page}`);

    console.log(rows)
    // Organize Data
    const rosters = rows.reduce((acc, row) => {
      const { roster_id, user_id, prompt_id, player_id, total_salary, total_penalty } = row;

      if (!acc[roster_id]) {
        acc[roster_id] = { 
          roster_id, 
          user_id, 
          username: row.username || 'Guest', 
          prompt_id, 
          total_salary: row.total_salary || 0, 
          total_penalty: row.total_penalty || 0, 
          players: [] 
        };
      }

      if (player_id) {
        acc[roster_id].players.push({
          player_id,
          first_name: row.first_name,
          last_name: row.last_name,
          team_id: row.team_id,
          team_name: row.team_name,
          salary: row.salary || 0
        });
      }

      return acc;
    }, {});

    console.log(`Processed ${Object.keys(rosters).length} rosters`);

    // Get Total Rosters Count
    const countSql = `SELECT COUNT(DISTINCT roster_id) as total FROM rosters`;
    const [countRows] = await pool.query(countSql);
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      rosters: Object.values(rosters),
      currentPage: page,
      totalPages,
      totalRosters: total
    });
  } catch (error) {
    console.error('Error fetching explore rosters:', error);
    res.status(500).send({ error: 'An error occurred while fetching explore rosters' });
  }
});



// Route to get a leaderboard for a specific prompt_id
app.get('/api/leaderboard/:prompt_id', async (req, res) => {
  const { prompt_id } = req.params;

  try {
    // Query to fetch the leaderboard data with usernames
    const sql = `
      SELECT 
        r.user_id, 
        COALESCE(u.username, 'Guest') AS username,
        (r.total_salary + r.total_penalty) AS score
      FROM rosters r
      LEFT JOIN users u ON r.user_id = u.user_id
      WHERE r.prompt_id = ?
      ORDER BY score ASC
    `;

    const [rows] = await pool.query(sql, [prompt_id]);

    if (rows.length === 0) {
      return res.status(404).send({ message: `No rosters found for prompt_id: ${prompt_id}` });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).send('An error occurred while fetching the leaderboard');
  }
});



  
  
// Start the server and listen on a specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});