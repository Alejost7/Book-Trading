import '../../../styles/beforeLogin/features.css';
import imageRef from '../../../assets/images/OIP.jpeg';
import imageSpy from '../../../assets/images/spideyPFP.jpg';
import imagePersonalizable from '../../../assets/images/fondoHero.jpg';
import { useState } from 'react';

const Features = () => {
    const [selectedFeature, setSelectedFeature] = useState(null);

    const handleFeatureClick = (feature) => {
        setSelectedFeature(feature);
    };

    return (
        <section className="features-container">
            <h2 className="features-title">Nuestras Características</h2>
            <ul className="features-list">
                <li 
                    className={`feature-item ${selectedFeature === "facil" ? "active" : ""}`}
                    onClick={() => handleFeatureClick("facil")}
                >
                    Fácil de usar
                </li>
                <li 
                    className={`feature-item ${selectedFeature === "moderno" ? "active" : ""}`}
                    onClick={() => handleFeatureClick("moderno")}
                >
                    Diseño moderno
                </li>
                <li 
                    className={`feature-item ${selectedFeature === "personalizable" ? "active" : ""}`}
                    onClick={() => handleFeatureClick("personalizable")}
                >
                    Personalizable
                </li>
            </ul>
            {selectedFeature && (
                <div className="features-img">
                    {selectedFeature === "facil" && <img src={imageRef} alt="Característica fácil de usar" />}
                    {selectedFeature === "moderno" && <img src={imageSpy} alt="Diseño moderno" />}
                    {selectedFeature === "personalizable" && <img src={imagePersonalizable} alt="Personalizable" />}
                </div>
            )}
        </section>
    );
};

export default Features;
