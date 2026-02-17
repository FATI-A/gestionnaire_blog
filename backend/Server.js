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
  password: "teksat123",
  port: 5432
});

app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        title, 
        content, 
        image AS "imageUrl", 
        author AS "authorName", 
        date
      FROM article
      ORDER BY id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.post('/posts', async (req, res) => {
  const { title, content, image, authorName } = req.body;

  try {
    await pool.query(
      `INSERT INTO article (title, content, image, author) VALUES ($1, $2, $3, $4)`,
      [title, content, image, authorName]
    );

    res.status(201).json({ message: "Document enregistré !" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.listen(3000, () => console.log("API running on http://localhost:3000"));