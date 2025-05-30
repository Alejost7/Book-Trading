import { Link } from 'react-router-dom';
import '../../../styles/beforeLogin/footer.css';

const Footer = () => {
    return (
        <div>
            <footer>
                <Link to='/aboutUs' className='section-route'>¿Quienes somos?</Link>
                <Link to='/ayuda' className='section-route'>¿Necesitas Ayuda?</Link>
                <Link to='/frecuentQuestions' className='section-route'>Preguntas Frecuentes</Link>
            </footer>
            <p>© 2025, Todos los Derechos Reservados</p>
        </div>
    );
};

export default Footer;