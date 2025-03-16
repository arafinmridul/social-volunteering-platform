const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    urgency: { type: String, enum: ['Low', 'Medium', 'High'], required: true }, // Urgency levels
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who created the post
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] // Comments on the post
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
