const express = require('express');
const fs = require('fs');
const mysql = require('mysql2'); // or use mongodb if preferred

const app = express();
const PORT = process.env.PORT || 80;

// Database connection (adjust host to your DB VM private IP)
const db = mysql.createConnection({
  host: process.env.DB_HOST || '10.0.0.4', // replace with DB VM IP
  user: process.env.DB_USER || 'azureuser',
  password: process.env.DB_PASS || 'yourpassword',
  database: process.env.DB_NAME || 'myappdb'
});

// Simple route
app.get('/', (req, res) => {
  // Save state/data to disk
  const logEntry = `Request at ${new Date().toISOString()}\n`;
  fs.appendFileSync('/mnt/appdata/requests.log', logEntry);

  // Query DB
  db.query('SELECT NOW() AS time', (err, results) => {
    if (err) {
      res.status(500).send('DB error: ' + err.message);
    } else {
      res.send(`Hello from Node.js! DB time: ${results[0].time}`);
    }
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});