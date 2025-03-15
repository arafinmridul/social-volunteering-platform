const Event = require('../models/Event');
const User = require('../models/User');

// @desc   Get all events
// @route  GET /api/events
// @access Public
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('createdBy', 'name').populate('participants', 'name');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc   Get event by ID
// @route  GET /api/events/:id
// @access Public
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('createdBy', 'name').populate('participants', 'name');
        if (!event) return res.status(404).json({ message: 'Event not found' });

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc   Create new event
// @route  POST /api/events
// @access Private
const createEvent = async (req, res) => {
    try {
        const { title, description, date, time, location, category } = req.body;

        if (!title || !description || !date || !time || !location || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const event = new Event({
            title,
            description,
            date,
            time,
            location,
            category,
            createdBy: req.user.id,
        });

        const savedEvent = await event.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc   Update event
// @route  PUT /api/events/:id
// @access Private
const updateEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc   Delete event
// @route  DELETE /api/events/:id
// @access Private
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await event.deleteOne();
        res.status(200).json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc   User joins an event
// @route  POST /api/events/:id/join
// @access Private
const joinEvent = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const event = await Event.findById(req.params.id);

        if (!user || !event) return res.status(404).json({ message: 'User or event not found' });

        // Check if user is already in event
        if (!event.participants.includes(user._id)) {
            event.participants.push(user._id);
            await event.save();
        }

        // Check if event is already in user's history
        if (!user.eventHistory.includes(event._id)) {
            user.eventHistory.push(event._id);
            await user.save();
        }

        res.status(200).json({ message: 'Joined event successfully', event });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createEvent, getEvents, getEventById, updateEvent, deleteEvent, joinEvent };
