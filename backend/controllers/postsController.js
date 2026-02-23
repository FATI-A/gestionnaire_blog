const postModel = require('../models/postModel');

// GET
const getPosts = async (req, res) => {
  try {
    const posts = await postModel.getAllPosts();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// POST
const addPost = async (req, res) => {
  const { title, content, image, authorName } = req.body;

  try {
    await postModel.createPost(title, content, image, authorName);
    res.status(201).json({ message: "Document enregistré !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// PUT
const editPost = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, content, image } = req.body;

  try {
    const rowCount = await postModel.updatePost(id, title, content, image);

    if (rowCount === 0) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    res.json({ message: "Article mis à jour" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// DELETE
const removePost = async (req, res) => {
  const { id } = req.params;

  try {
    const rowCount = await postModel.deletePost(id);

    if (rowCount === 0) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    res.json({ message: "Article supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getPosts,
  addPost,
  editPost,
  removePost
};