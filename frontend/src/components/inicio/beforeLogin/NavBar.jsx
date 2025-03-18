import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Search from "./search";
import logo from "../../../assets/images/libroLogo.png";
import '../../../styles/beforeLogin/navBar.css';


const Navbar = () => {
    const location = useLocation();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

return (
    <nav className='navBar'>
        <Link to="/">
            <img className='logo' src={logo} alt="" /></Link>
        <Search />
        <Link to="/" className={`section-route ${location.pathname === "/" ? "active" : ""}`}>Inicio</Link>
        {isAuthenticated ? (
            <Link to="/afterLogin" className="section-route">BookZone</Link>
        ) : (
            <Link to="/registro" className={`section-route ${location.pathname === "/registro" ? "active" : ""}`}>Ingreso</Link>
        )}
    </nav>
    );
};

export default Navbar;
