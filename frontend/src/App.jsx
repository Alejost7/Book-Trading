import './styles/App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BeforeLogin from './components/inicio/beforeLogin/BeforeLogin';
import AfterLogin from './components/inicio/afterLogin/AfterLogin';
import MiPerfil from './components/miPerfil/MiPerfil';
import Ayuda from './components/ayuda/Ayuda';
import MyBooks from './components/tradeLibros/MyBooks';
import Donacion from './components/donaciones/Donaciones';

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
            element={<Donacion/>}
          />
          <Route
            path="/afterLogin/myBooks"
            element={<MyBooks/>}
          />
        </Routes>
    </Router>
  );
}

export default App
