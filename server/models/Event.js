const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true }, // Time as string (e.g., "14:30" or "2:30 PM")
        location: { type: String, required: true },
        category: { type: String, required: true }, // e.g., "Community Service", "Education"
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who joined
    },
    { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
