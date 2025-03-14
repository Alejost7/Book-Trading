import NavBar from "./NavBar";
import Hero from "./Hero";
import Features from "./Features";
import Footer from "./Footer";
import Registro from "../../registroInicio/Registro";
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

const BeforeLogin = () => {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("isAuthenticated") === "true"
    );

    useEffect(() => {
        const auth = localStorage.getItem("isAuthenticated");
        setIsAuthenticated(auth === "true");
    }, []);

    return (
        <div>
            <NavBar isAuthenticated={isAuthenticated}/>
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