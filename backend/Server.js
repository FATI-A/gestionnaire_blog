const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const postsRoutes = require('./routes/posts');
app.use('/posts', postsRoutes);

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});