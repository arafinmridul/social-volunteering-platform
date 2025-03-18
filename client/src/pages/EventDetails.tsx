import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Grid,
    Avatar,
    Chip,
} from "@mui/material";

interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: string;
    createdBy: {
        name: string;
    };
    participants: {
        _id: string;
        name: string;
    }[];
}

export default function EventDetails() {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [updatedEvent, setUpdatedEvent] = useState<
        Omit<Event, "_id" | "participants" | "createdBy">
    >({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        category: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`/api/events/${id}`);
                setEvent(res.data);
                setUpdatedEvent({
                    title: res.data.title,
                    description: res.data.description,
                    date: res.data.date.split("T")[0],
                    time: res.data.time,
                    location: res.data.location,
                    category: res.data.category,
                });
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleJoinEvent = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                window.open("/login", "_blank"); // Open login in a new tab
                return;
            }

            await axios.post(
                `/api/events/${id}/join`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const res = await axios.get(`/api/events/${id}`);
            setEvent(res.data);
        } catch (error: any) {
            console.error("Error joining event:", error);
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status < 500
            ) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        }
    };

    const handleEditEvent = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                window.open("/login", "_blank"); // Open login in a new tab
                return;
            }

            await axios.put(`/api/events/${id}`, updatedEvent, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvent((prevEvent) =>
                prevEvent ? { ...prevEvent, ...updatedEvent } : prevEvent
            );
            setIsEditDialogOpen(false);
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 403) {
                    alert("Only the creator of this event can edit or delete.");
                } else if (
                    error.response.status >= 400 &&
                    error.response.status < 500
                ) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            } else {
                console.error("Error updating event:", error);
            }
        }
    };

    const handleDeleteEvent = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                window.open("/login", "_blank"); // Open login in a new tab
                return;
            }

            await axios.delete(`/api/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate("/"); // Redirect to the homepage or events list
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 403) {
                    alert("Only the creator of this event can edit or delete.");
                } else if (
                    error.response.status >= 400 &&
                    error.response.status < 500
                ) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            } else {
                console.error("Error deleting event:", error);
            }
        }
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

    if (!event) {
        return <Typography variant="h6">Event not found</Typography>;
    }

    return (
        <Box padding={2}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography
                                variant="h4"
                                gutterBottom
                                sx={{ fontWeight: 600 }}
                            >
                                {event.title}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {event.description}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Date:</strong>{" "}
                                {new Date(event.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Time:</strong> {event.time}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Location:</strong> {event.location}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Category:</strong> {event.category}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Created by:</strong>{" "}
                                {event.createdBy.name}
                            </Typography>
                        </CardContent>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            padding={2}
                        >
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#212121",
                                    color: "white",
                                }}
                                onClick={handleJoinEvent}
                            >
                                Join Event
                            </Button>

                            <>
                                <Button
                                    variant="contained"
                                    onClick={() => setIsEditDialogOpen(true)}
                                >
                                    Edit Event
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleDeleteEvent}
                                >
                                    Delete Event
                                </Button>
                            </>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{ fontWeight: 600 }}
                            >
                                Participants
                            </Typography>
                            {event.participants.length > 0 ? (
                                event.participants.map((participant) => (
                                    <Chip
                                        key={participant._id}
                                        avatar={
                                            <Avatar>
                                                {participant.name[0]}
                                            </Avatar>
                                        }
                                        label={participant.name}
                                        sx={{ margin: "4px" }}
                                    />
                                ))
                            ) : (
                                <Typography variant="body2">
                                    No participants yet.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Dialog
                open={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
            >
                <DialogTitle>Edit Event</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={updatedEvent.title}
                        onChange={(e) =>
                            setUpdatedEvent({
                                ...updatedEvent,
                                title: e.target.value,
                            })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        value={updatedEvent.description}
                        onChange={(e) =>
                            setUpdatedEvent({
                                ...updatedEvent,
                                description: e.target.value,
                            })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Date"
                        type="date"
                        fullWidth
                        value={updatedEvent.date}
                        onChange={(e) =>
                            setUpdatedEvent({
                                ...updatedEvent,
                                date: e.target.value,
                            })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Time"
                        fullWidth
                        value={updatedEvent.time}
                        onChange={(e) =>
                            setUpdatedEvent({
                                ...updatedEvent,
                                time: e.target.value,
                            })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Location"
                        fullWidth
                        value={updatedEvent.location}
                        onChange={(e) =>
                            setUpdatedEvent({
                                ...updatedEvent,
                                location: e.target.value,
                            })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Category"
                        fullWidth
                        value={updatedEvent.category}
                        onChange={(e) =>
                            setUpdatedEvent({
                                ...updatedEvent,
                                category: e.target.value,
                            })
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleEditEvent}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
