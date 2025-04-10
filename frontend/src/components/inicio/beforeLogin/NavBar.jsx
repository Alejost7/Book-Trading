import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Search from "./search";
import logo from "../../../assets/images/libroLogo.png";
import '../../../styles/beforeLogin/navBar.css';

const Navbar = () => {
    const location = useLocation();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    return (
        <motion.nav
            className='navBar'
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
            <Link to="/" className="logo-container">
                <motion.img
                    className='logo'
                    src={logo}
                    alt="Logo"
                    whileHover={{ 
                        rotate: 5,
                        scale: 1.1,
                        transition: { duration: 0.3 }
                    }}
                />
            </Link>
            
            <Search />
            
            <div className="nav-links">
                <Link to="/" className={`section-route ${location.pathname === "/" ? "active" : ""}`}>
                    <motion.span
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Inicio
                    </motion.span>
                </Link>
                
                {isAuthenticated ? (
                    <Link to="/afterLogin" className="section-route">
                        <motion.span
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            BookZone
                        </motion.span>
                    </Link>
                ) : (
                    <Link to="/registro" className={`section-route ${location.pathname === "/registro" ? "active" : ""}`}>
                        <motion.span
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Ingreso
                        </motion.span>
                    </Link>
                )}
            </div>
        </motion.nav>
    );
};

export default Navbar;
