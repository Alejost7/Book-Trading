import '../../../styles/beforeLogin/poligonos.css';
import perfilIcon from '../../../assets/icons/avatar-de-hombre.png';
import ayuda from '../../../assets/icons/ayuda.png';
import sobreNosotros from '../../../assets/icons/sobre-nosotros.png';
import libroIcon from '../../../assets/icons/lectura.png';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openModal } from '../../../Redux/modalSlice';
import AuthModal from './AuthModal';

const Poligonos = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const handleAuthClick = (e) => {
        e.preventDefault();
        dispatch(openModal("auth"));
    };

    return(
        <div className="poligonos">
            <div className="poligono poligono1">
                {isAuthenticated ? (
                    <Link to="/miPerfil">
                        <img src={perfilIcon} alt="Perfil" />
                        <span className="tooltip">Ir a mi perfil</span> 
                    </Link>
                ) : (
                    <Link to="#" onClick={handleAuthClick}>
                        <img src={perfilIcon} alt="Perfil" />
                        <span className="tooltip">Ir a mi perfil</span> 
                    </Link>
                )}
            </div>
            <div className="poligono poligono2">
                <Link to="/ayuda">
                    <img src={ayuda} alt="Ayuda" />
                    <span className="tooltip">Ayuda</span>
                </Link>
            </div>
            <div className="poligono poligono3">
                <Link to="/aboutUs">
                    <img src={sobreNosotros} alt="Sobre Nosotros" />
                    <span className="tooltip">Sobre Nosotros</span>
                </Link>
            </div>
            <div className="poligono poligono4">
                {isAuthenticated ? (
                    <Link to="/Donaciones">
                        <img src={libroIcon} alt="Lectura" />
                        <span className="tooltip">Donar Libros</span>
                    </Link>
                ) : (
                    <Link to="#" onClick={handleAuthClick}>
                        <img src={libroIcon} alt="Lectura" />
                        <span className="tooltip">Donar Libros</span>
                    </Link>
                )}
            </div>
            <AuthModal />
        </div>
    );
};

export default Poligonos;