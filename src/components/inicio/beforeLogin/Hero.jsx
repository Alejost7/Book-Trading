import Poligonos from './Poligonos';
import '../../../styles/beforeLogin/hero.css';
import servicios from '../../../assets/videos/nuestrosServicios.mp4';
const Hero = () => {
    return (
        <div>
            <header className='hero'>
                <h1 className="title">Bienvenido a BookSwap</h1>
                <p className="description">
                    Intercambia, descubre y disfruta de los libros con una comunidad apasionada por la lectura.
                </p>
                <Poligonos />
                <video className="video-hero" autoPlay loop muted>
                    <source src={servicios} type="video/mp4" />
                    Tu navegador no soporta la reproducción de videos.
                </video>
            </header>
        </div>
    );
};

export default Hero;