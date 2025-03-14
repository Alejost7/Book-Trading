import '../../../styles/beforeLogin/features.css';
import imageRef from '../../../assets/images/imageLibraryRef.jpg';
const Features = () => {
    return (
        <section className="features-container">
            <h2 className="features-title">Nuestras Características</h2>
            <ul className="features-list">
                <li className="feature-item">Fácil de usar</li>
                <li className="feature-item">Diseño moderno</li>
                <li className="feature-item">Soporte 24/7</li>
                <li className="feature-item">Personalizable</li>
            </ul>
            <div className="features-img">
                <img src={imageRef}></img>
            </div>
        </section>
    );
};

export default Features;
