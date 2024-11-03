// frontend/src/components/BlogDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';

const ExpandableCard = styled(Card)(({ theme, expanded }) => ({
  transition: 'transform 0.5s ease-in-out',
  transform: expanded ? 'rotateY(360deg)' : 'rotateY(0deg)',
  position: 'relative',
}));

function BlogDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5001/blogs/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlogs(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };    
    fetchBlogs();
  }, []);

  const handleExpandClick = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleDeleteClick = (id) => {
    setSelectedBlogId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/blogs/${selectedBlogId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { password }, // Include password for re-authentication
      });
      setBlogs(blogs.filter(blog => blog.id !== selectedBlogId));
      setDeleteDialogOpen(false);
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete blog');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Your Blog Dashboard
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/new')}
        sx={{ mb: 3 }}
      >
        Create New Blog
      </Button>

      {blogs.length === 0 ? (
        <Typography>No blogs available.</Typography>
      ) : (
        blogs.map((blog) => (
          <ExpandableCard
            key={blog.id}
            expanded={expandedCard === blog.id}
            sx={{ mb: 3 }}
          >
            <CardContent>
              <Typography variant="h5" component="div" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                {blog.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Author:</strong> {blog.author}
              </Typography>
              <Typography variant="body1" paragraph>
                {expandedCard === blog.id
                  ? blog.content
                  : `${blog.content.substring(0, 100)}...`}
              </Typography>
            </CardContent>

            <CardActions sx={{ justifyContent: 'space-between' }}>
              <IconButton
                onClick={() => handleExpandClick(blog.id)}
                color="primary"
                sx={{ mr: 1 }}
              >
                <ExpandMoreIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => handleDeleteClick(blog.id)}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </ExpandableCard>
        ))
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This is a permanent action and canot be reversed or undone. Are you sure you want to delete this blog?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BlogDashboard;
