import Poligonos from './Poligonos';
import '../../styles/hero.css';
import servicios from '../../assets/videos/nuestrosServicios.mp4';
const Hero = () => {
    return (
        <div>
            <header className='hero'>
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