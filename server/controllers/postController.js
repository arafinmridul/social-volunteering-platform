const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Get all posts (public)
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('createdBy', 'name') // Get the post creator's name
            .populate({
                path: 'comments',
                populate: { path: 'userId', select: 'name' } // Get commenter names
            });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get post by ID (public)
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('createdBy', 'name') // Get the post creator's name
            .populate({
                path: 'comments',
                populate: { path: 'userId', select: 'name' } // Get commenter names
            });

        if (!post) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create a new post
const createPost = async (req, res) => {
    try {
        const { title, description, urgency } = req.body;
        const newPost = new Post({ title, description, urgency, createdBy: req.user.id });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a post
const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }

        const { title, description, urgency } = req.body;
        post.title = title || post.title;
        post.description = description || post.description;
        post.urgency = urgency || post.urgency;

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a post
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await Comment.deleteMany({ postId: post._id }); // Delete associated comments
        await post.deleteOne();
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };
