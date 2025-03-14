import { Link } from "react-router-dom";
import Search from "./search";
import logo from "../../../assets/images/libroLogo.png";
import '../../../styles/beforeLogin/navBar.css';

const Navbar = ({ isAuthenticated }) => {
return (
<nav className='navBar'>
    <Link to="/">
        <img className='logo' src={logo} alt="" /></Link>
    <Search />
    <Link to="/" className='section-route'>Inicio</Link>
    {isAuthenticated ? (
        <Link to="/afterLogin" className="section-route">BookZone</Link>
    ) : (
        <Link to="/registro" className='section-route'>Ingreso</Link>
    )}
</nav>
);
};

export default Navbar;
