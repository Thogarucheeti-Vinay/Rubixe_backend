const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database("./messageus.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the contacts database.");
});

db.run(`CREATE TABLE IF NOT EXISTS contacts (
  id VARCHAR(50) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  message TEXT
)`);

app.post("/messageus", (req, res) => {
  const { id, name, email, phone, message } = req.body;

  const sql = `INSERT INTO contacts (id, name, email, phone, message) VALUES (?, ?, ?, ?, ?)`;
  const values = [id, name, email, phone, message];

  db.run(sql, values, function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).send("Failed to add contact to database.");
    } else {
      res.status(200).send("Contact added to database.");
    }
  });
});

// Get all contacts from the database
app.get("/messageus", (req, res) => {
  const sql = `SELECT email FROM contacts`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Failed to get contacts from database.");
    } else {
      const emails = rows.map((row) => row.email);
      res.status(200).json(emails);
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
