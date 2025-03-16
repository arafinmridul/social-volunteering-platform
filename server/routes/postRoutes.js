const express = require('express');
const {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
} = require('../controllers/postController');
const { addComment, getCommentsByPost } = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Post routes
router.get('/', getAllPosts); // Get all posts (public)
router.get('/:id', getPostById); // Get single post
router.post('/', authMiddleware, createPost); // Create a post
router.put('/:id', authMiddleware, updatePost); // Update a post
router.delete('/:id', authMiddleware, deletePost); // Delete a post

// Comment routes
router.post('/:postId/comments', authMiddleware, addComment); // Add comment
router.get('/:postId/comments', getCommentsByPost); // Get comments for a post

module.exports = router;
