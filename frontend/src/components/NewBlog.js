// frontend/src/components/NewBlog.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/blogs/create', { title, content }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/dashboard'); // Redirect to dashboard after successful creation
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create blog post');
    }
  };

  return (
    <div>
      <h1>Create New Blog</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Create Blog</button>
      </form>
    </div>
  );
}

export default NewBlog;
