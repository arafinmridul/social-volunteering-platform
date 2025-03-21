import { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardActions,
    Typography,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: string;
    participants: string[];
}

export default function EventDashboard() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newEvent, setNewEvent] = useState<
        Omit<Event, "_id" | "participants">
    >({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        category: "",
    });
    const navigate = useNavigate();

    const url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get(`${url}/api/events`);
                setEvents(res.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleCreateEvent = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                window.open("/login", "_blank"); // Open login in a new tab
                return;
            }

            await axios.post(`${url}/api/events`, newEvent, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNewEvent({
                title: "",
                description: "",
                date: "",
                time: "",
                location: "",
                category: "",
            });
            setIsCreateDialogOpen(false);
            // Refresh events after creating a new one
            const res = await axios.get(`${url}/api/events`);
            setEvents(res.data);
        } catch (error: any) {
            console.error("Error creating event:", error);
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status < 500
            ) {
                localStorage.removeItem("token"); // Clear token
                navigate("/login");
            }
        }
    };

    const handleJoinEvent = async (eventId: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                window.open("/login", "_blank"); // Open login in a new tab
                return;
            }

            await axios.post(
                `${url}/api/events/${eventId}/join`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            // Optionally refresh events or update state to reflect the change
            const res = await axios.get(`${url}/api/events`);
            setEvents(res.data);
            navigate(`/events/${eventId}`);
        } catch (error: any) {
            console.error("Error joining event:", error);
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status < 500
            ) {
                localStorage.removeItem("token"); // Clear token
                navigate("/login");
            }
        }
    };

    const handleEventClick = (eventId: string) => {
        navigate(`/events/${eventId}`);
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    width: "100%",
                }}
            >
                <CircularProgress size={70} sx={{ color: "black" }} />
            </Box>
        );
    }

    return (
        <Box padding={2}>
            <Button
                variant="contained"
                onClick={() => setIsCreateDialogOpen(true)}
                sx={{ backgroundColor: "#212121", color: "white" }}
            >
                Create Event
            </Button>
            <Grid container spacing={2} marginTop={2}>
                {events.map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event._id}>
                        <Card>
                            <CardContent>
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 600 }}
                                >
                                    {event.title}
                                </Typography>
                                <Typography variant="body2">
                                    {event.description}
                                </Typography>
                                <Typography variant="body2">
                                    Date:{" "}
                                    {new Date(event.date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2">
                                    Time: {event.time}
                                </Typography>
                                <Typography variant="body2">
                                    Location: {event.location}
                                </Typography>
                                <Typography variant="body2">
                                    Category: {event.category}
                                </Typography>
                                <Typography variant="body2">
                                    Participants: {event.participants.length}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleEventClick(event._id)}
                                    sx={{
                                        color: "black",
                                        borderColor: "black",
                                    }}
                                >
                                    View Details
                                </Button>
                                <Button
                                    sx={{
                                        backgroundColor: "#212121",
                                        color: "white",
                                    }}
                                    size="small"
                                    onClick={() => handleJoinEvent(event._id)}
                                >
                                    Join
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
            >
                <DialogTitle>Create Event</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={newEvent.title}
                        onChange={(e) =>
                            setNewEvent({ ...newEvent, title: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        value={newEvent.description}
                        onChange={(e) =>
                            setNewEvent({
                                ...newEvent,
                                description: e.target.value,
                            })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Date"
                        type="date"
                        fullWidth
                        value={newEvent.date}
                        onChange={(e) =>
                            setNewEvent({ ...newEvent, date: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Time"
                        fullWidth
                        value={newEvent.time}
                        onChange={(e) =>
                            setNewEvent({ ...newEvent, time: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Location"
                        fullWidth
                        value={newEvent.location}
                        onChange={(e) =>
                            setNewEvent({
                                ...newEvent,
                                location: e.target.value,
                            })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Category"
                        fullWidth
                        value={newEvent.category}
                        onChange={(e) =>
                            setNewEvent({
                                ...newEvent,
                                category: e.target.value,
                            })
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        sx={{
                            color: "black",
                            borderColor: "black",
                        }}
                        onClick={() => setIsCreateDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#212121", color: "white" }}
                        onClick={handleCreateEvent}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
