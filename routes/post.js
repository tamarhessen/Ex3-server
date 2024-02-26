const postController = require('../controllers/post');

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// Posts
router.get('/api/Posts', authenticateToken, postController.getPosts); ////////////////
router.post('/api/Posts', authenticateToken, postController.createPost);
router.get('/api/Posts/:postId', authenticateToken, postController.getPostById);
router.delete('/api/Posts/:postId', authenticateToken, postController.deletePost);
router.post('/api/Posts/:postId/Edit', authenticateToken, postController.editPost);
router.post('/api/Posts/:postId/Comments', authenticateToken, postController.createComment);
router.get('/api/Posts/:postId/Comments', authenticateToken, postController.getCommentsByPostId);
router.delete('/api/Posts/:postId/Comments/:commentId', authenticateToken, postController.deleteComment);
router.post('/api/Posts/:postId/Comments/:commentId/Edit', authenticateToken, postController.editComment);
router.get('/api/Posts/:postId/Like', authenticateToken, postController.likePost);




// Tokens
router.post('/api/Tokens', postController.generateToken);

// Users
router.get('/api/Users/:username', authenticateToken, postController.getUserByUsername);
router.post('/api/Users', postController.registerUser);

// Other routes
router.get('/*',postController.redirectHome)

module.exports = router;