const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "blog",
  password: "0000",
  port: 5432
});

app.get('/posts', async (req, res) => {
  const result = await pool.query("SELECT * FROM article ORDER BY id DESC");
  res.json(result.rows);
});

app.post('/posts', async (req, res) => {
  const { title, content } = req.body;

  try {
    await pool.query(
      `INSERT INTO article (title, content) VALUES ($1, $2)`,
      [title, content]
    );

    res.status(201).json({ message: "Document enregistré !" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.listen(3000, () => console.log("API running on http://localhost:3000"));