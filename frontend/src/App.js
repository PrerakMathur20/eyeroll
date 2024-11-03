// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import BlogDashboard from './components/BlogDashboard';
import SignUp from './components/SignUp';
import NewBlog from './components/NewBlog';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  console.log("isAuth: ", isAuth);

  const handleLogout = () => {
    setIsAuth(false);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }} 
            onClick={() => window.location.href = '/'}>
              Blog App
            </Typography>
            {isAuth ? (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button color="inherit" href="/signup">
                  Sign Up
                </Button>
                <Button color="inherit" href="/">
                  Login
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>

        <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
          <Routes>
            {!isAuth ? (
              <>
                <Route path="/" element={<Login setAuth={setIsAuth} />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            ) : (
              <>
                <Route path="/dashboard" element={<BlogDashboard />} />
                <Route path="/new" element={<NewBlog />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            )}
          </Routes>
        </Container>

        <Box component="footer" sx={{ py: 1, textAlign: 'center', bgcolor: 'background.default' }}>
          <Typography variant="body2" color="text.secondary">
            © Prerak Mathur 2024
          </Typography>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
