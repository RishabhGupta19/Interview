const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Rish@134", 
  database: "hello_world_db",
};

let connection;

async function initializeDatabase() {
  try {
    
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await tempConnection.end();

    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to MySQL");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task VARCHAR(255) NOT NULL
      )
    `);
    console.log("Todos table ready");
  } catch (err) {
    console.error("Database initialization error:", err.message);
    process.exit(1);
  }
}

// Get all todos
app.get("/api/todos", async (req, res) => {
  try {
    const [rows] = await connection.query("SELECT * FROM todos ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a todo
app.post("/api/todos", async (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ error: "Task is required" });
  try {
    const [result] = await connection.query("INSERT INTO todos (task) VALUES (?)", [task]);
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo
app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await connection.query("DELETE FROM todos WHERE id = ?", [id]);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
