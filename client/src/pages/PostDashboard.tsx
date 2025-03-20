import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    Typography,
    CircularProgress,
    Dialog,
    DialogTitle,
    TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Post {
    _id: string;
    title: string;
    description: string;
    urgency: string;
    createdBy: {
        name: string;
    };
}

export default function PostDashboard() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newPost, setNewPost] = useState({
        title: "",
        description: "",
        urgency: "Low",
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get("/api/posts");
                setPosts(res.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleCreatePost = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                window.open("/login", "_blank");
                return;
            }

            await axios.post("/api/posts", newPost, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNewPost({ title: "", description: "", urgency: "Low" });
            setIsCreateDialogOpen(false);

            // Refresh posts after creating a new one
            const res = await axios.get("/api/posts");
            setPosts(res.data);
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    const handlePostClick = (postId: string) => {
        navigate(`/posts/${postId}`);
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
                Create Post
            </Button>
            <Grid container spacing={2} marginTop={2}>
                {posts.map((post) => (
                    <Grid item xs={12} sm={6} md={4} key={post._id}>
                        <Card>
                            <CardContent>
                                <Typography
                                    sx={{ fontWeight: 600 }}
                                    variant="h5"
                                >
                                    {post.title}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    marginTop={0.5}
                                >
                                    {post.description.slice(0, 100)}...
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    marginTop={2}
                                    sx={{ fontWeight: 600 }}
                                >
                                    Urgency: {post.urgency}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        color: "black",
                                        borderColor: "black",
                                    }}
                                    size="small"
                                    onClick={() => handlePostClick(post._id)}
                                >
                                    Details
                                </Button>
                                <Button
                                    sx={{
                                        backgroundColor: "#212121",
                                        color: "white",
                                    }}
                                    size="small"
                                    onClick={() =>
                                        navigate(`/posts/${post._id}#comments`)
                                    }
                                >
                                    Comments
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
                <DialogTitle>Create Post</DialogTitle>
                <Box padding={2}>
                    <TextField
                        fullWidth
                        label="Title"
                        value={newPost.title}
                        onChange={(e) =>
                            setNewPost({ ...newPost, title: e.target.value })
                        }
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={newPost.description}
                        onChange={(e) =>
                            setNewPost({
                                ...newPost,
                                description: e.target.value,
                            })
                        }
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <TextField
                        fullWidth
                        label="Urgency"
                        value={newPost.urgency}
                        onChange={(e) =>
                            setNewPost({ ...newPost, urgency: e.target.value })
                        }
                        margin="normal"
                    />
                    <Button
                        variant="contained"
                        onClick={handleCreatePost}
                        sx={{
                            backgroundColor: "#212121",
                            color: "white",
                            marginTop: 2,
                        }}
                    >
                        Create
                    </Button>
                </Box>
            </Dialog>
        </Box>
    );
}
