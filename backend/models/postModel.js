const pool = require('../db');

// Get all posts
const getAllPosts = async () => {
  const result = await pool.query(`
    SELECT id, title, content, image AS "imageUrl", author AS "authorName", date
    FROM article
    ORDER BY date DESC
  `);
  return result.rows;
};

// Add post
const createPost = async (title, content, image, authorName) => {
  await pool.query(
    `INSERT INTO article (title, content, image, author)
     VALUES ($1, $2, $3, $4)`,
    [title, content, image, authorName]
  );
};

// Update post
const updatePost = async (id, title, content, image) => {
  const result = await pool.query(
    `UPDATE article
     SET title = $1,
         content = $2,
         image = $3,
         date = CURRENT_TIMESTAMP
     WHERE id = $4`,
    [title, content, image, id]
  );
  return result.rowCount;
};

// Delete post
const deletePost = async (id) => {
  const result = await pool.query(
    `DELETE FROM article WHERE id = $1`,
    [id]
  );
  return result.rowCount;
};

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost
};