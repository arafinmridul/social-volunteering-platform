import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Comment {
    _id: string;
    text: string;
    userId: {
        name: string;
    };
}

interface Post {
    _id: string;
    title: string;
    description: string;
    urgency: string;
    createdBy: {
        name: string;
    };
    comments: Comment[];
}

export default function PostDetails() {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [updatedPost, setUpdatedPost] = useState({
        title: "",
        description: "",
        urgency: "",
    });
    const navigate = useNavigate();

    const url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`${url}/api/posts/${id}`);
                setPost(res.data);
                setUpdatedPost({
                    title: res.data.title,
                    description: res.data.description,
                    urgency: res.data.urgency,
                });
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleAddComment = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                window.open("/login", "_blank");
                return;
            }

            const res = await axios.post(
                `${url}/api/posts/${id}/comments`,
                { text: newComment },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setPost((prevPost) =>
                prevPost
                    ? {
                          ...prevPost,
                          comments: [...prevPost.comments, res.data],
                      }
                    : prevPost
            );
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleEditPost = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                window.open("/login", "_blank");
                return;
            }

            await axios.put(`${url}/api/posts/${id}`, updatedPost, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPost((prevPost) =>
                prevPost ? { ...prevPost, ...updatedPost } : prevPost
            );
            setIsEditDialogOpen(false);
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 403) {
                    alert("Only the creator of this post can edit or delete.");
                } else if (
                    error.response.status >= 400 &&
                    error.response.status < 500
                ) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            } else {
                console.error("Error editing post:", error);
            }
        }
    };

    const handleDeletePost = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                window.open("/login", "_blank");
                return;
            }

            await axios.delete(`${url}/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate("/posts"); // Redirect to the homepage or posts list
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 403) {
                    alert("Only the creator of this post can edit or delete.");
                } else if (
                    error.response.status >= 400 &&
                    error.response.status < 500
                ) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            } else {
                console.error("Error deleting post:", error);
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

    if (!post) {
        return <Typography variant="h6">Post not found</Typography>;
    }

    return (
        <Box padding={2}>
            <Typography sx={{ fontWeight: 600 }} variant="h4">
                {post.title}
            </Typography>
            <Typography variant="body1" marginTop={2}>
                {post.description}
            </Typography>
            <Typography
                sx={{ fontWeight: 600 }}
                variant="body1"
                color="text.secondary"
                marginTop={1}
            >
                Urgency: {post.urgency}
            </Typography>
            <Typography
                sx={{
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 600,
                    marginTop: 4,
                }}
                variant="subtitle1"
            >
                <Box
                    sx={{
                        flex: 1,
                        height: "1px",
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        marginRight: 2,
                    }}
                />
                Comments
                <Box
                    sx={{
                        flex: 1,
                        height: "1px",
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        marginLeft: 2,
                    }}
                />
            </Typography>
            <List>
                {post.comments.map((comment) => (
                    <ListItem key={comment._id}>
                        <ListItemText
                            primary={comment.text}
                            secondary={`By: ${comment.userId.name}`}
                        />
                    </ListItem>
                ))}
            </List>
            <Box marginTop={2}>
                <TextField
                    fullWidth
                    label="Add a comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    multiline
                    rows={3}
                />
                <Button
                    variant="contained"
                    onClick={handleAddComment}
                    sx={{
                        backgroundColor: "#212121",
                        color: "white",
                        marginTop: 2,
                    }}
                >
                    Comment
                </Button>
            </Box>
            <Box marginTop={4} display="flex" justifyContent="right" gap={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsEditDialogOpen(true)}
                >
                    Edit Post
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeletePost}
                >
                    Delete Post
                </Button>
            </Box>

            {/* Edit Post Dialog */}
            <Dialog
                open={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
            >
                <DialogTitle>Edit Post</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={updatedPost.title}
                        onChange={(e) =>
                            setUpdatedPost({
                                ...updatedPost,
                                title: e.target.value,
                            })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        value={updatedPost.description}
                        onChange={(e) =>
                            setUpdatedPost({
                                ...updatedPost,
                                description: e.target.value,
                            })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Urgency"
                        fullWidth
                        value={updatedPost.urgency}
                        onChange={(e) =>
                            setUpdatedPost({
                                ...updatedPost,
                                urgency: e.target.value,
                            })
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleEditPost}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
