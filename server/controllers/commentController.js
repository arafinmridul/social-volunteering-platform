const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Add a comment to a post
const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.postId);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        const newComment = new Comment({ postId: post._id, userId: req.user.id, text });
        await newComment.save();

        post.comments.push(newComment._id);
        await post.save();

        // Populate the userId field before sending the response
        const populatedComment = await newComment.populate('userId', 'name');

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all comments for a post
const getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).populate('userId', 'name');
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { addComment, getCommentsByPost };
