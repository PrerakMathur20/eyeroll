// frontend/src/components/BlogDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function BlogDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchBlogs = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5001/blogs/all', {
          headers: { Authorization: `Bearer ${token}` }, // Use Bearer token format
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

  if (loading) {
    return <p>Loading blogs...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h1>Your Blog Dashboard</h1>
      <button onClick={() => navigate('/new')} style={{ marginBottom: '20px' }}>
        Create New Blog
      </button>
      {blogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog.id} style={{ border: '1px solid #ccc', padding: '16px', margin: '16px 0' }}>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
            <p><strong>Author:</strong> {blog.author}</p> {/* Assuming 'author' is a property */}
            <p><strong>Created At:</strong> {new Date(blog.created_at).toLocaleDateString()}</p> {/* Assuming 'created_at' is a property */}
          </div>
        ))
      )}
    </div>
  );
}

export default BlogDashboard;
