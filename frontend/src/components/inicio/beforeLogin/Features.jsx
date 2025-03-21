import '../../../styles/beforeLogin/features.css';
import { useState } from 'react';
import imageRef from '../../../assets/images/imageLibraryRef.jpg';
import TestAPI from '../../tests/TestAPI';

const Features = () => {
    const[mostrarTestAPI, setMostrarTestAPI] = useState(false);

    return (
        <section className="features-container">
            <h2 className="features-title">Nuestras Características</h2>
            <ul className="features-list">
                <li className="feature-item">Fácil de usar</li>
                <li className="feature-item">Diseño moderno</li>
                <li className="feature-item">Soporte 24/7</li>
                <li className="feature-item">Personalizable</li>
                <li 
                    className="feature-item" 
                    onClick={() => setMostrarTestAPI(!mostrarTestAPI)}>{mostrarTestAPI ? "ocultar mensaje del servidor" : "mensaje desde el servidor" }</li>
            </ul>
            <div className="features-img">
                <img src={imageRef}></img>
            </div>
            {mostrarTestAPI && <TestAPI/>}
        </section>
    );
};

export default Features;
