import '../../../styles/beforeLogin/poligonos.css';
import perfilIcon from '../../../assets/icons/avatar-de-hombre.png';
import ayuda from '../../../assets/icons/ayuda.png';
import sobreNosotros from '../../../assets/icons/sobre-nosotros.png';
import libroIcon from '../../../assets/icons/lectura.png';
import { Link } from 'react-router-dom';

const Poligonos = () => {
    return(
        <div className="poligonos">
            <div className="poligono poligono1">
                <Link to="/miPerfil">
                    <img src={perfilIcon} alt="Perfil" />
                    <span className="tooltip">Ir a mi perfil</span> 
                </Link>
            </div>
            <div className="poligono poligono2">
                <Link to="/ayuda">
                    <img src={ayuda} alt="Ayuda" />
                    <span className="tooltip">Ayuda</span>
                </Link>
            </div>
            <div className="poligono poligono3">
                <img src={sobreNosotros} alt="Sobre Nosotros" />
                <span className="tooltip">Sobre Nosotros</span>
            </div>
            <div className="poligono poligono4">
                <Link to="/Donaciones">
                    <img src={libroIcon} alt="Lectura" />
                    <span className="tooltip">Donar Libros</span>
                </Link>
            </div>
        </div>
    );
};

export default Poligonos;