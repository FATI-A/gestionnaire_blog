const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

router.get('/', postsController.getPosts);
router.post('/', postsController.addPost);
router.put('/:id', postsController.editPost);
router.delete('/:id', postsController.removePost);

module.exports = router;