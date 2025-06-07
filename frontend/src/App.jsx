import './styles/App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BeforeLogin from './components/inicio/beforeLogin/BeforeLogin.jsx';
import AfterLogin from './components/inicio/afterLogin/AfterLogin.jsx';
import MiPerfil from './components/miPerfil/MiPerfil.jsx';
import Ayuda from './components/ayuda/Ayuda.jsx';
import MyBooks from './components/tradeLibros/MyBooks.jsx';
import Donaciones from "./components/donaciones/Donaciones.jsx";
import AboutUs from './components/AboutUs.jsx';
import FrecuentQuestions from './components/FrecuentQuestions.jsx';

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
      <Router>
        <Routes>
          <Route path="/*" element={<BeforeLogin />} />
          <Route 
            path="/afterLogin" 
            element={isAuthenticated ? <AfterLogin /> : <Navigate to="/" />} 
          />
          <Route
            path="/miPerfil"
            element={<MiPerfil/>}
          />
          <Route
            path="/ayuda"
            element={<Ayuda/>}
          />
          <Route
            path="/Donaciones"
            element={<Donaciones/>}
          />
          <Route
            path="/afterLogin/myBooks"
            element={<MyBooks/>}
          />
          <Route
            path="/aboutUs"
            element={<AboutUs/>}
          />
          <Route
            path="/frecuentQuestions"
            element={<FrecuentQuestions/>}
          />
        </Routes>
    </Router>
  );
}

export default App
