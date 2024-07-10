const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 4000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// MySQL Connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "users",
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// GET endpoint to fetch all users (just for reference, not required for login)
app.get("/", (req, res) => {
  connection.query("SELECT * FROM user_details", (err, rows) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error fetching users" });
    }
    res.json(rows); // Send JSON response with users data
  });
});

// POST endpoint to register a new user
app.post("/", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const sql = "INSERT INTO user_details (username, password) VALUES (?, ?)";
  connection.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error("Error inserting user:", err);
      return res.status(500).json({ error: "Error registering user" });
    }
    console.log("User registered successfully");
    res.status(200).json({ message: "User registered successfully" });
  });
});

// POST endpoint to handle user login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const sql = "SELECT * FROM user_details WHERE username = ? AND password = ?";
  connection.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error executing query" });
    }

    if (results.length === 0) {
      console.log("invalid credentials");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // User found, login successful
    console.log("login successful");
    res.status(200).json({ message: "Login successful", user: results[0] });
  });
});
app.listen(4000);