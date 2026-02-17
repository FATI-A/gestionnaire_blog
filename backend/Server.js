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

// Routes API get
app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, content, image AS "imageUrl", author AS "authorName", date
      FROM article
      ORDER BY date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
 // Routes API add post
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


// Routes API update post
app.put('/posts/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, content, image } = req.body;

  try {
    const result = await pool.query(
      `UPDATE article
       SET title = $1,
           content = $2,
           image = $3,
           date = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [title, content, image, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    res.status(200).json({ message: 'Article mis à jour' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// Routes API delete post
app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM article WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    res.status(200).json({ message: 'Article supprimé' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.listen(3000, () => console.log("API running on http://localhost:3000"));