import { Link } from 'react-router-dom';
import '../../../styles/beforeLogin/footer.css';

const Footer = () => {
    return (
        <div>
            <footer>
                <Link to='/quienes somos' className='section-route'>¿Quienes somos?</Link>
                <Link to='/ayuda' className='section-route'>¿Necesitas Ayuda?</Link>
                <Link to='/informacion' className='section-route'>Información de Contacto</Link>
                <Link to='/preguntas' className='section-route'>Preguntas Frecuentes</Link>
            </footer>
            <p>© 2025, Todos los Derechos Reservados</p>
        </div>
    );
};

export default Footer;