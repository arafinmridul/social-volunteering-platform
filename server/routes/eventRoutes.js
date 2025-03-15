const express = require('express');
const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    joinEvent,
} = require('../controllers/eventController');
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CRUD operations for events
router.get('/', getEvents); // Get all events
router.get('/:id', getEventById); // Get a single event
router.post('/', authMiddleware, createEvent); // Create event
router.put('/:id', authMiddleware, updateEvent); // Update event
router.delete('/:id', authMiddleware, deleteEvent); // Delete event

// User joins an event
router.post('/:id/join', authMiddleware, joinEvent);

module.exports = router;
