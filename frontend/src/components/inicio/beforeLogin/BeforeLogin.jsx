import NavBar from "./NavBar";
import Hero from "./Hero";
import Features from "./Features";
import Footer from "./Footer";
import Registro from "../../registroInicio/Registro";
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BeforeLogin = () => {
    const location = useLocation();
    
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    console.log("Estado de autenticación: ", isAuthenticated);

    return (
        <div>
            <NavBar/>
            <Routes location={location}>
                <Route path = "/" element = {
                    <div>
                        <Hero/>
                        <Features/>
                        <Footer/>
                    </div>
                } />
                <Route path ="registro" element={isAuthenticated ? <Navigate to="/afterLogin" /> : <Registro />} />
            </Routes>
        </div>
    );
};

export default BeforeLogin;