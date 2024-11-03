// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import BlogDashboard from './components/BlogDashboard';
import SignUp from './components/SignUp';
import NewBlog from './components/NewBlog'; // Import the NewBlog component

function App() {
  const [isAuth, setIsAuth] = useState(false);
  console.log("isAuth: ", isAuth);

  return (
    <Router>
      <Routes>
        {!isAuth ? (
          <>
            <Route path="/" element={<Login setAuth={setIsAuth} />} />
            <Route path="/signup" element={<SignUp />} />
          </>
        ) : (
          <>
            <Route path="/dashboard" element={<BlogDashboard />} />
            <Route path="/new" element={<NewBlog />} /> {/* Route for creating a new blog */}
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
