import './styles/App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BeforeLogin from './components/inicio/beforeLogin/BeforeLogin';
import AfterLogin from './components/inicio/afterLogin/AfterLogin';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(auth === "true");
  }, []);
  return (
      <Router>
        <Routes>
          <Route path="/*" element={<BeforeLogin />} />
          <Route 
            path="/afterLogin" 
            element={isAuthenticated ? <AfterLogin /> : <Navigate to="/" />} 
          />
        </Routes>
    </Router>
  );
}

export default App
