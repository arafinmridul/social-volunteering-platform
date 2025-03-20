import { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import {
    Box,
    Typography,
    Card,
    Grid,
    Button,
    Chip,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

interface UserProfile {
    name: string;
    gender: string;
    skills: string[];
    interests: string[];
    bio: string;
    eventHistory: { title: string; date: string }[];
}

export default function Profile() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editableUser, setEditableUser] = useState<UserProfile | null>(null);
    const navigate = useNavigate();

    // Fetch user data from backend
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found");
                    navigate("/login");
                    return;
                }

                const res = await axios.get("/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser(res.data);
            } catch (error: any) {
                console.error("Error fetching profile:", error);
                navigate("/login");
                localStorage.removeItem("token"); // Clear token
            }
        };

        fetchProfile();
    }, []);

    const handleEditClick = () => {
        setEditableUser(user);
        setIsEditDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsEditDialogOpen(false);
    };

    const handleSave = async () => {
        if (!editableUser) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                navigate("/login");
                return;
            }

            await axios.put("/api/users/profile", editableUser, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUser(editableUser);
            setIsEditDialogOpen(false);
        } catch (error: any) {
            console.error("Error updating profile:", error);
            localStorage.removeItem("token"); // Clear token
            navigate("/login");
        }
    };

    if (!user) {
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
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                padding: 2,
                backgroundColor: "background.default",
            }}
        >
            <Card
                sx={{ maxWidth: 800, width: "100%", boxShadow: 3, padding: 3 }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 3,
                    }}
                >
                    <Box>
                        <Typography variant="h4">{user.name}</Typography>
                        <Typography variant="body1" color="text.secondary">
                            {user.gender}
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        sx={{
                            marginLeft: "auto",
                            backgroundColor: "#212121",
                            color: "white",
                        }}
                        onClick={handleEditClick}
                    >
                        Edit Profile
                    </Button>
                </Box>
                <Divider sx={{ marginBottom: 3 }} />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Skills</Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                                marginTop: 1,
                            }}
                        >
                            {user.skills.map((skill, index) => (
                                <Chip
                                    key={index}
                                    label={skill}
                                    sx={{
                                        backgroundColor: "#212121",
                                        color: "white",
                                    }}
                                />
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Interests</Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                                marginTop: 1,
                            }}
                        >
                            {user.interests.map((interest, index) => (
                                <Chip
                                    key={index}
                                    label={interest}
                                    sx={{
                                        backgroundColor: "#212121",
                                        color: "white",
                                    }}
                                />
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Bio</Typography>
                        <Typography variant="body1" color="text.secondary">
                            {user.bio}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Event History</Typography>
                        <Box sx={{ marginTop: 1 }}>
                            {user.eventHistory.map((event, index) => (
                                <Typography
                                    key={index}
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    {event.title}
                                </Typography>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Card>

            {/* Edit Dialog */}
            <Dialog
                open={isEditDialogOpen}
                onClose={handleDialogClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        sx={{ color: "black" }}
                        margin="dense"
                        label="Name"
                        fullWidth
                        value={editableUser?.name || ""}
                        onChange={(e) =>
                            setEditableUser((prev) => ({
                                ...prev!,
                                name: e.target.value,
                            }))
                        }
                    />
                    <TextField
                        sx={{ color: "black" }}
                        margin="dense"
                        label="Gender"
                        fullWidth
                        value={editableUser?.gender || ""}
                        onChange={(e) =>
                            setEditableUser((prev) => ({
                                ...prev!,
                                gender: e.target.value,
                            }))
                        }
                    />
                    <TextField
                        sx={{ color: "black" }}
                        margin="dense"
                        label="Skills (comma-separated)"
                        fullWidth
                        value={editableUser?.skills.join(", ") || ""}
                        onChange={(e) =>
                            setEditableUser((prev) => ({
                                ...prev!,
                                skills: e.target.value
                                    .split(",")
                                    .map((s) => s.trim()),
                            }))
                        }
                    />
                    <TextField
                        sx={{ color: "black" }}
                        margin="dense"
                        label="Interests (comma-separated)"
                        fullWidth
                        value={editableUser?.interests.join(", ") || ""}
                        onChange={(e) =>
                            setEditableUser((prev) => ({
                                ...prev!,
                                interests: e.target.value
                                    .split(",")
                                    .map((i) => i.trim()),
                            }))
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Bio"
                        fullWidth
                        multiline
                        rows={3}
                        value={editableUser?.bio || ""}
                        onChange={(e) =>
                            setEditableUser((prev) => ({
                                ...prev!,
                                bio: e.target.value,
                            }))
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} sx={{ color: "black" }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        sx={{ backgroundColor: "#212121", color: "white" }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
