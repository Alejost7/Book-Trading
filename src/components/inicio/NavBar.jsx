import { Link } from "react-router-dom";
import Search from "./search";
import logo from "../../assets/images/libroLogo.png";
import '../../styles/navBar.css';

const Navbar = () => {
return (
<nav className='navBar'>
    <Link to="/">
        <img className='logo' src={logo} alt="" /></Link>
    <Search />
    <Link to="/" className='section-route'>Inicio</Link>
    <Link to="/registro" className='section-route'>Registro</Link>
</nav>
);
};

export default Navbar;
