import './styles/App.css'
import Features from './components/inicio/Features'
import Hero from './components/inicio/Hero'
import NavBar from './components/inicio/NavBar'
import Footer from './components/inicio/Footer'
import Registro from './components/registroInicio/Registro'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
      <div>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={
              <div>
                <Hero />
                <Features />
                <Footer />
              </div>
              } />
            <Route path="/registro" element={<Registro />} />
          </Routes>
        </Router>
      </div>
  );
}

export default App
