const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

const app = express();

app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: 'dbm3r9ke3',
  api_key: '167866493258976',
  api_secret: '_-qjO6iqxlXwWAyHB3ttD-DBnqk'
});
app.get('/cloud-images', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({ type: 'upload', max_results: 50 });
    const images = result.resources.map(img => img.secure_url);
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de récupérer les images Cloudinary' });
  }
});

// Routes
const postsRoutes = require('./routes/posts');
app.use('/posts', postsRoutes);

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});