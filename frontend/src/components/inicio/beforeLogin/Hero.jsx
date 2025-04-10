import { motion } from 'framer-motion';
import Poligonos from './Poligonos';
import '../../../styles/beforeLogin/hero.css';
import servicios from '../../../assets/videos/nuestrosServicios.mp4';

const Hero = () => {
    return (
        <div>
            <header className='hero'>
                <motion.h1 
                    className="title"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Bienvenido a BookSwap
                </motion.h1>
                <motion.p 
                    className="description"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Intercambia, descubre y disfruta de los libros con una comunidad apasionada por la lectura.
                </motion.p>
                <Poligonos />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <video className="video-hero" autoPlay loop muted>
                        <source src={servicios} type="video/mp4" />
                        Tu navegador no soporta la reproducción de videos.
                    </video>
                </motion.div>
            </header>
        </div>
    );
};

export default Hero;