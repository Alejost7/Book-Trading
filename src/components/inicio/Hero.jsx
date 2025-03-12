import tradeLibro from '../../assets/images/tradeLibro.png';
import Poligonos from './Poligonos';
import '../../styles/hero.css';
const Hero = () => {
    return (
        <div>
            <header className='hero'>
                <h1>¡Bienvenido a nuestra página!</h1>
                <p>Descubre todos los servicios que podemos ofrecerte</p>
                <Poligonos />
                <img className='img-hero' src= {tradeLibro} alt="" />
            </header>
        </div>
    );
};

export default Hero;