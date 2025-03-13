import tradeLibro from '../../assets/images/imageLibraryRef.jpg';
import Poligonos from './Poligonos';
import '../../styles/hero.css';
const Hero = () => {
    return (
        <div>
            <header className='hero'>
                <h1 className='text-hero'>¡Bienvenido a nuestra página!</h1>
                <p>Descubre todos los servicios que podemos ofrecerte</p>
                <Poligonos />
                <img className='img-hero' src= {tradeLibro} alt="" />
            </header>
        </div>
    );
};

export default Hero;